import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserDto } from 'src/common/dtos';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  count(filter: FilterQuery<UserDocument> = {}) {
    return this.userModel.count(filter);
  }

  find(filter: FilterQuery<UserDocument> = {}) {
    return this.userModel.find(filter);
  }

  findOne(filter: FilterQuery<UserDocument> = {}) {
    return this.userModel.findOne(filter);
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
    // TODO: 刷新
    // this.freshUserSubscribe();
    return user;
  }

  /**
   * 获取并创建用户
   * @param code 用户Code
   * @returns 用户DTO
   */
  async getCreateCurrentUser(body: any) {
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

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAllUser(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
