import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schemas/user.schema';
import { Pagination } from 'src/common/helper';
import { PaginationRequestDto } from 'src/common/dtos';
import { PaginationResponseVo } from 'src/common/interfaces';
import { SamplePointDocument } from 'src/schemas/samplePoint.schema';

@Injectable()
export class SampleService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('SamplePoint')
    private samplePointModel: Model<SamplePointDocument>,
  ) {}

  async getPoints(
    pagination: PaginationRequestDto,
  ): Promise<PaginationResponseVo<any>> {
    const totals = await this.samplePointModel.count();
    const userDtos = await this.samplePointModel
      .find()
      .sort({ _id: 1 })
      .skip(pagination.skip)
      .limit(pagination.size);

    return Pagination.of(pagination, totals, userDtos);
  }

  async getUsers(
    pagination: PaginationRequestDto,
  ): Promise<PaginationResponseVo<any>> {
    const totals = await this.userModel.count();
    const userDtos = await this.userModel
      .find()
      .sort({ _id: 1 })
      .skip(pagination.skip)
      .limit(pagination.size);
    // Logger.debug('skip + size: ' + pagination.size);
    // Logger.debug(userDtos.length);

    return Pagination.of(pagination, totals, userDtos);
  }
}
