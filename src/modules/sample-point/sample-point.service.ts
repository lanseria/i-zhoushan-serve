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
import { decodeStr, encodeStr } from 'src/common/utils';

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
    this.proxyToSchema(decodeBody.data);
    return decodeBody;
  }

  async proxyToSchema(proxyData: ProxySamplePoint[]) {
    //
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
          coordinates: [+item.gisLng, +item.gisLat],
        },
      });
    });
    // const orgIds = schemaData.map((item) => item.orgId);
    // const docs = await this.samplePointModel.find({
    //   orgId: { $nin: orgIds },
    // });
    // console.log(schemaData);
    this.samplePointModel
      .insertMany(schemaData, {
        ordered: false,
      })
      .catch((e) => {
        this.logger.warn(e);
      });
  }
}
