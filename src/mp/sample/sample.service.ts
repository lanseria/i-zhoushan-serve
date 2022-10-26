import { Injectable } from '@nestjs/common';
import got from 'got';
import { decodeStr, encodeStr } from './utils';
import { SampleHeaders } from './const';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/dto/create-user.dto';

@Injectable()
export class SampleService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  getCreateCurrentUser(code: string) {
    throw new Error('Method not implemented.');
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
