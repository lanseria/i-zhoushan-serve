import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { SAMPLE_SUBSCRIBE_TEMPLATE_ID } from 'src/common/const';
import { MpService } from 'src/modules/mp/mp.service';
import { SamplePointService } from '../sample-point/sample-point.service';
import { UserService } from '../user/user.service';
import { dayjs } from 'src/common/utils';

@Injectable()
export class CronService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private userService: UserService,
    private samplePointService: SamplePointService,
    private configService: ConfigService,
    @Inject(forwardRef(() => MpService))
    private readonly mpService: MpService,
  ) {}

  private readonly logger = new Logger(CronService.name);

  async onApplicationBootstrap() {
    const isDev = this.configService.get<boolean>('env.isDev');
    this.logger.debug(isDev);
    this.logger.debug('启动定时任务服务钩子');
    // 清空所有定时任务，以免越来越多
    this.removeAllCrons();
    // 刷新用户订阅定时任务
    this.freshUserSubscribe(true);
    // 每小时获取一次全部核酸采样点数据(仅限正式环境)
    !isDev && this.freshSamplePoint();
    // 获取当前任务
    this.getCrons();
  }
  /**
   * 每小时获取一次全部核酸采样点数据
   */
  freshSamplePoint() {
    //
    const job = new CronJob('0 0 * * * *', () => {
      // 执行获取部核酸采样点任务
      this.logger.warn('执行获取部核酸采样点任务');
      this.samplePointService.gotSamplePoint();
    });
    this.schedulerRegistry.addCronJob('每日每小时获取浙江省核酸采样点', job);
    job.start();
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
   * 刷新用户订阅服务与其他定时任务
   */
  async freshUserSubscribe(isInit = false) {
    this.logger.debug('获取/刷新所有开启订阅的用户');
    // 清空用户订阅
    const users = await this.userService.find({ isSubscribe: true });
    !isInit &&
      users.forEach((user) => {
        this.schedulerRegistry.deleteCronJob(user._id);
      });
    // 重新用户订阅
    users.forEach((user) => {
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
      this.logger.debug(
        `job: ${key} -> next: ${dayjs(next).locale('zh-cn').format('LLLL')}`,
      );
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
