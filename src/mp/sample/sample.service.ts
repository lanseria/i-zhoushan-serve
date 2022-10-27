import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import got from 'got';
import { decodeStr, encodeStr } from './utils';
import {
  MP_LOGIN_sns_jscode2session,
  SAMPLEHEADERS,
  SAMPLE_SUBSCRIBE_TEMPLATE_ID,
} from './const';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
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
    private configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
    private mpService: MpService,
  ) {}

  private readonly logger = new Logger(SampleService.name);

  async onApplicationBootstrap() {
    this.logger.debug('启动核酸采样服务钩子');
    this.freshUserSubscribe();
  }

  async freshUserSubscribe() {
    this.removeAllCrons();
    this.logger.debug('获取/刷新所有开启订阅的用户');
    const users = await this.userModel.find({ isSubscribe: true });
    users.map((user) => {
      const nextDate = dayjs.unix(user.nextSampleDateTime).toDate();
      // this.logger.debug(nextDate);
      const job = new CronJob(nextDate, () => {
        //todo 推送消息
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

  removeAllCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key, map) => {
      this.schedulerRegistry.deleteCronJob(key);
    });
  }

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

  async subscribeSampleSend(openid: string) {
    const access_token = await this.mpService.token();
    const user = await this.userModel.findOne({ openid });
    const nextDate = dayjs
      .unix(user.nextSampleDateTime)
      .format('YYYY年MM月DD日 HH:mm');
    this.logger.debug(nextDate);
    const data = {
      time2: {
        value: nextDate,
      },
      thing3: {
        value: '请进入小程序后继续点击确认订阅来再次获取核酸提醒',
      },
    };
    this.mpService.subscribeMessageSend(
      access_token,
      openid,
      SAMPLE_SUBSCRIBE_TEMPLATE_ID,
      data,
    );
  }

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

  async getCreateCurrentUser(code: string) {
    this.logger.debug('code: ' + code);
    const res = await got.get(MP_LOGIN_sns_jscode2session, {
      searchParams: {
        appid: this.configService.get<string>('mp.appid'),
        secret: this.configService.get<string>('mp.secret'),
        js_code: code,
        grant_type: 'authorization_code',
      },
    });
    // {"session_key":"H7fLpQuhbAAqyLYa7blgBw==","openid":"oab3W5S60tJPVI8PKZLs8Z_GPf6s"}
    this.logger.debug('login data: ' + res.body);
    const body = JSON.parse(res.body);
    //  this.logger.debug(body);
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
