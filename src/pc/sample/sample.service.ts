import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { PaginationResponseDto } from 'src/common/dtos';
import { PaginationRequest } from 'src/common/interfaces';
import { Pagination } from 'src/common/helper';

@Injectable()
export class SampleService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async getUsers(
    pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<any>> {
    const totals = await this.userModel.count();
    const userDtos = await this.userModel
      .find()
      .sort({ _id: 1 })
      .skip(pagination.skip)
      .limit(pagination.limit);

    return Pagination.of(pagination, totals, userDtos);
  }
}
