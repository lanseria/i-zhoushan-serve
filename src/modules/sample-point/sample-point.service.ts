import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  SamplePoint,
  SamplePointDocument,
} from 'src/schemas/samplePoint.schema';
import { Cache } from 'cache-manager';
import { ProxySamplePoint } from 'src/common/interfaces';
import { GotService } from '../got/got.service';
import { decodeStr, encodeStr, gcj02towgs84 } from 'src/common/utils';
import * as lodash from 'lodash';

@Injectable()
export class SamplePointService {
  constructor(
    @InjectModel('SamplePoint')
    private samplePointModel: Model<SamplePointDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private gotService: GotService,
  ) {}

  private readonly logger = new Logger(SamplePointService.name);

  count(filter: FilterQuery<SamplePointDocument> = {}) {
    return this.samplePointModel.count(filter);
  }

  find(filter: FilterQuery<SamplePointDocument> = {}) {
    return this.samplePointModel.find(filter);
  }

  findOne(filter: FilterQuery<SamplePointDocument> = {}) {
    return this.samplePointModel.findOne(filter);
  }

  /**
   * 转发代理核酸采样点
   * @param paramData 用户地理位置信息
   * @returns 核酸采样点
   */
  async getSample(paramData: any) {
    const body = encodeStr(paramData);
    this.logger.debug('client send: ' + body);
    let encodeValue: string = await this.cacheManager.get(body);
    if (encodeValue) {
      this.logger.debug('use cache');
    } else {
      this.logger.debug('use realtime');
      const res = await this.gotService.getSamplePoint(body);
      await this.cacheManager.set(body, res.body, 1800 * 1000);
      encodeValue = res.body;
      // this.logger.debug('use realtime: ' + encodeValue);
    }
    const decodeBody = decodeStr(encodeValue);
    return decodeBody;
  }

  async gotSamplePoint() {
    const paramData = {
      orgName: '',
      pageNum: 1,
      pageSize: 14967,
      areaName: '',
      levelName: '',
      serviceStatus: '',
      gisLat: '',
      gisLng: '',
      isFree: '',
      isRed: '',
      isYellow: '',
      isNeedHs: '',
      isLive: '0',
    };
    const body = encodeStr(paramData);
    const res = await this.gotService.getSamplePoint(body);
    const encodeValue = res.body;
    const decodeBody = decodeStr(encodeValue);
    this.proxyToSchema(decodeBody.data);
  }

  async proxyToSchema(proxyData: ProxySamplePoint[]) {
    const databaseData = await this.samplePointModel.find({}).sort({ _id: 1 });
    const databaseDataIds = databaseData.map((m) => m.orgId);
    // 所有待插入的数据
    const schemaData: SamplePoint[] = proxyData.map((item) => {
      return new this.samplePointModel({
        orgId: item.orgId,
        orgName: item.orgName,
        areaCode: item.areaCode,
        areaName: item.areaName,
        address: item.address,
        phone: item.phone,
        workTime: item.workTime,
        levelName: item.levelName,
        orgType: item.orgType,
        serviceStatus: item.serviceStatus,
        distanceHospital: item.distanceHospital,
        isFree: item.isFree,
        isFever: item.isFever,
        isNeedHs: item.isNeedHs,
        isRed: item.isRed,
        isYellow: item.isYellow,
        location: {
          type: 'Point',
          // 存数据库用 wgs84
          coordinates: gcj02towgs84([+item.gisLng, +item.gisLat]),
        },
      });
    });
    // const orgIds = schemaData.map((item) => item.orgId);
    // const docs = await this.samplePointModel.find({
    //   orgId: { $nin: orgIds },
    // });
    // console.log(schemaData);
    const schemaDataOrgIds = schemaData.map((m) => m.orgId);
    const insertIds = lodash.difference(schemaDataOrgIds, databaseDataIds);
    const updateIds = schemaDataOrgIds.filter((m) => !insertIds.includes(m));
    this.logger.debug('insert ids is: ' + insertIds);
    const insertItems = schemaData.filter((m) => insertIds.includes(m.orgId));
    // 插入信息
    await this.samplePointModel
      .insertMany(insertItems, {
        // true 则在遇到重复后则中断插入 false 则不中断
        ordered: false,
      })
      .catch((e) => {
        this.logger.warn(e);
      });
    // 移除已有的
    await this.samplePointModel.deleteMany({
      orgId: {
        $in: updateIds,
      },
    });
    const updateItems = schemaData.filter((m) => updateIds.includes(m.orgId));
    // 更新信息
    await this.samplePointModel
      .insertMany(updateItems, {
        // true 则在遇到重复后则中断插入 false 则不中断
        ordered: false,
      })
      .catch((e) => {
        this.logger.warn(e);
      });
    // 更新信息
    // this.samplePointModel.updateMany({
    //   orgId: {
    //     $in: updateIds,
    //   },
    // }, {
    //   $set: {
    //     serviceStatus:
    //   }
    // });
  }
}
