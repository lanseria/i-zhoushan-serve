import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import got from 'got';
import { decodeStr, encodeStr } from './utils';
import { SAMPLEHEADERS, SAMPLE_SUBSCRIBE_TEMPLATE_ID } from './const';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/dto/create-user.dto';
import * as dayjs from 'dayjs';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { MpService } from '../mp.service';
import { Cache } from 'cache-manager';

@Injectable()
export class SampleService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private schedulerRegistry: SchedulerRegistry,
    private mpService: MpService,
  ) {}

  private readonly logger = new Logger(SampleService.name);

  async onApplicationBootstrap() {
    this.logger.debug('启动核酸采样服务钩子');
    this.freshUserSubscribe();
  }
  /**
   * 刷新用户订阅服务
   */
  async freshUserSubscribe() {
    this.removeAllCrons();
    this.logger.debug('获取/刷新所有开启订阅的用户');
    const users = await this.userModel.find({ isSubscribe: true });
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
    const user = await this.userModel.findOne({ openid });
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
  /**
   * 更新当前用户信息
   * @param createUserDto 用户DTO
   * @returns 用户DTO
   */
  async updateCurrentUser(createUserDto: CreateUserDto) {
    if (createUserDto.isSubscribe) {
      createUserDto.nextSampleDateTime = dayjs
        .unix(createUserDto.currentSampleDateTime)
        .add(createUserDto.intervalDay, 'day')
        .unix();
    }
    const user = await this.userModel.findOneAndUpdate(
      { openid: createUserDto.openid },
      createUserDto,
    );
    this.freshUserSubscribe();
    return user;
  }
  /**
   * 获取并创建用户
   * @param code 用户Code
   * @returns 用户DTO
   */
  async getCreateCurrentUser(code: string) {
    const body = await this.mpService.login(code);
    const user = await this.userModel.findOne({
      openid: body.openid,
    });
    if (user) {
      return user;
    } else {
      const createUserDto = new CreateUserDto();
      createUserDto.openid = body.openid;
      createUserDto.isSubscribe = false;
      createUserDto.currentSampleDateTime = dayjs().unix();
      createUserDto.intervalDay = 3;
      createUserDto.nextSampleDateTime = dayjs().add(3, 'day').unix();
      const createdUser = new this.userModel(createUserDto);
      return createdUser.save();
    }
  }
  /**
   * 转发代理核酸采样点
   * @param paramData 用户地理位置信息
   * @returns 核酸采样点
   */
  async getSampleV1(paramData: any) {
    const body = encodeStr(paramData);
    const value = await this.cacheManager.get(body);
    if (value) {
      return value;
    } else {
      const res = await got.post(
        'https://hsddcx.wsjkw.zj.gov.cn/client-api/search/getNucleicAcidOrgList',
        {
          body,
          headers: SAMPLEHEADERS,
        },
      );
      const decodeBody = decodeStr(res.body);
      await this.cacheManager.set(body, decodeBody);
      return decodeBody;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAllUser(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
