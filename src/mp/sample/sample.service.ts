import { Injectable, Logger } from '@nestjs/common';
import got from 'got';
import { decodeStr, encodeStr } from './utils';
import { MP_LOGIN_sns_jscode2session, SampleHeaders } from './const';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';

@Injectable()
export class SampleService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

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
    return user;
  }

  async getCreateCurrentUser(code: string) {
    Logger.log(code);
    const res = await got.get(MP_LOGIN_sns_jscode2session, {
      searchParams: {
        appid: this.configService.get<string>('mp.appid'),
        secret: this.configService.get<string>('mp.secret'),
        js_code: code,
        grant_type: 'authorization_code',
      },
    });
    // {"session_key":"H7fLpQuhbAAqyLYa7blgBw==","openid":"oab3W5S60tJPVI8PKZLs8Z_GPf6s"}
    Logger.log(res.body);
    const body = JSON.parse(res.body);
    // Logger.log(body);
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
    const res = await got.post(
      'https://hsddcx.wsjkw.zj.gov.cn/client-api/search/getNucleicAcidOrgList',
      {
        body,
        headers: SampleHeaders,
      },
    );
    const decodeBody = decodeStr(res.body);
    return decodeBody;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAllUser(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
