import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class SampleService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}
  async findAllUser(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
