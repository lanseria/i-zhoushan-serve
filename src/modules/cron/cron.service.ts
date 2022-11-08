import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import * as dayjs from 'dayjs';
import { SAMPLE_SUBSCRIBE_TEMPLATE_ID } from 'src/common/const';
import { MpService } from 'src/modules/mp/mp.service';
import { UserService } from '../user/user.service';

@Injectable()
export class CronService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private userService: UserService,
    @Inject(forwardRef(() => MpService))
    private readonly mpService: MpService,
  ) {}

  private readonly logger = new Logger(CronService.name);

  async onApplicationBootstrap() {
    this.logger.debug('启动定时任务服务钩子');
    this.freshUserSubscribe();
  }

  /**
   * 刷新用户订阅服务
   */
  async freshUserSubscribe() {
    this.removeAllCrons();
    this.logger.debug('获取/刷新所有开启订阅的用户');

    const users = await this.userService.find({ isSubscribe: true });
    users.map((user) => {
      const nextDate = dayjs.unix(user.nextSampleDateTime).toDate();
      const job = new CronJob(nextDate, () => {
        this.subscribeSampleSend(user.openid);
        job.stop();
        this.schedulerRegistry.deleteCronJob(user.openid);
        // 设置为未订阅
        user.isSubscribe = false;
        user.save();
      });
      this.schedulerRegistry.addCronJob(user.openid, job);
      job.start();
    });
    this.getCrons();
  }
  /**
   * 移除全部定时任务
   */
  removeAllCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key, map) => {
      this.schedulerRegistry.deleteCronJob(key);
    });
  }
  /**
   * 获取全部定时任务
   */
  getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key, map) => {
      let next;
      try {
        next = value.nextDates().toJSDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      this.logger.debug(`job: ${key} -> next: ${next}`);
    });
  }
  /**
   * 发送核酸采样到期提醒订阅
   * @param openid 用户openid
   */
  async subscribeSampleSend(openid: string) {
    const { access_token } = await this.mpService.token();
    const user = await this.userService.findOne({ openid });
    const nextDate = dayjs
      .unix(user.nextSampleDateTime)
      .format('YYYY年MM月DD日 HH:mm');
    const predictNextDate = dayjs
      .unix(user.nextSampleDateTime)
      .add(3, 'day')
      .unix();
    this.logger.debug('openid: ' + openid + 'nextDate: ' + nextDate);
    const data = {
      time2: {
        value: nextDate,
      },
      thing3: {
        value: '请进入小程序确认订阅来再次获取核酸提醒',
      },
    };
    this.mpService.subscribeMessageSend(
      access_token,
      openid,
      SAMPLE_SUBSCRIBE_TEMPLATE_ID,
      'pages/index/index?predictNextDate=' + predictNextDate,
      data,
    );
  }
}
