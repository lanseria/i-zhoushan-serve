import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { ParkingPointDocument } from 'src/schemas/parkingPoint.schema';

@Injectable()
export class ParkingPointService {
  constructor(
    @InjectModel('ParkingPoint')
    private parkingPointModel: Model<ParkingPointDocument>,
  ) {}

  find(filter: FilterQuery<ParkingPointDocument> = {}) {
    return this.parkingPointModel.find(filter);
  }
}
