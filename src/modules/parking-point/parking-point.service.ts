import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Feature, Point } from '@turf/turf';
import { FilterQuery, Model } from 'mongoose';
import {
  ParkingPoint,
  ParkingPointDocument,
} from 'src/schemas/parkingPoint.schema';
import * as lodash from 'lodash';

@Injectable()
export class ParkingPointService {
  constructor(
    @InjectModel('ParkingPoint')
    private parkingPointModel: Model<ParkingPointDocument>,
  ) {}
  private readonly logger = new Logger(ParkingPointService.name);

  find(filter: FilterQuery<ParkingPointDocument> = {}) {
    return this.parkingPointModel.find(filter);
  }

  async proxyToSchema(proxyData: Feature<Point>[]) {
    const databaseData = await this.parkingPointModel.find({}).sort({ _id: 1 });
    const databaseDataIds = databaseData.map((m) => m._id);
    const schemaData: any[] = proxyData.map((item) => {
      return {
        name: item.properties.name,
        address: item.properties.address,
        quality: item.properties.quality,
        isFree: item.properties.isFree,
        location: item.geometry.coordinates,
      };
    });
    this.logger.debug(schemaData);
    const schemaDataIds = schemaData.map((m) => m._id);

    const insertIds = lodash.difference(schemaDataIds, databaseDataIds);

    const updateIds = schemaDataIds.filter((m) => !insertIds.includes(m));
    const insertItems = schemaData.filter((m) => insertIds.includes(m._id));
    // 插入信息
    try {
      this.logger.debug(insertItems);
      const r1 = await this.parkingPointModel.insertMany(insertItems, {
        // true 则在遇到重复后则中断插入 false 则不中断
        ordered: false,
      });
      console.log(r1);
      // 移除已有的
      const r2 = await this.parkingPointModel.deleteMany({
        orgId: {
          $in: updateIds,
        },
      });
      console.log(r2);
      const updateItems = schemaData.filter((m) => updateIds.includes(m._id));

      // 更新信息
      const r3 = await this.parkingPointModel.insertMany(updateItems, {
        // true 则在遇到重复后则中断插入 false 则不中断
        ordered: false,
      });
      console.log(r3);
    } catch (e) {
      this.logger.warn(e);
    }
    return proxyData;
  }
}
