import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import {
  CreateUserDto,
  LocationBounds,
  PaginationRequestDto,
} from '../../common/dtos';
import { UserService } from 'src/modules/user/user.service';
import { SamplePointService } from 'src/modules/sample-point/sample-point.service';
import { CronService } from 'src/modules/cron/cron.service';
import { MpService } from 'src/modules/mp/mp.service';
import { Pagination } from 'src/common/helper';
import { PaginationResponseVo } from 'src/common/interfaces';
import * as turf from '@turf/turf';
@Injectable()
export class SampleService {
  constructor(
    private cronService: CronService,
    private mpService: MpService,
    private userService: UserService,
    private samplePointService: SamplePointService,
  ) {}

  private readonly logger = new Logger(SampleService.name);

  async getPointsMap(body: LocationBounds): Promise<any> {
    // const totals = await this.samplePointService.count();
    const bboxPolygon = turf.bboxPolygon(
      turf.bbox(
        turf.multiPoint([
          [body._ne.lng, body._ne.lat],
          [body._sw.lng, body._sw.lat],
        ]),
      ),
    );
    const samplePointDtos = await this.samplePointService
      .find({
        location: {
          $geoWithin: {
            $geometry: bboxPolygon.geometry,
          },
        },
      })
      .sort({ _id: 1 });
    const pointList = samplePointDtos.map((item) => {
      return turf.point(item.location.coordinates, {
        _id: item._id,
        orgId: item.orgId,
        orgName: item.orgName,
        serviceStatus: item.serviceStatus,
        orgType: item.orgType,
        levelName: item.levelName,
        workTime: item.workTime,
        areaCode: item.areaCode,
        areaName: item.areaName,
        address: item.address,
        phone: item.phone,
        isFree: item.isFree,
      });
    });
    const featureCollection = turf.featureCollection(pointList);
    return featureCollection;
  }

  async getPoints(
    pagination: PaginationRequestDto,
  ): Promise<PaginationResponseVo<any>> {
    const totals = await this.samplePointService.count();
    const samplePointDtos = await this.samplePointService
      .find({})
      .sort({ _id: 1 })
      .skip(pagination.skip)
      .limit(pagination.size);

    return Pagination.of(pagination, totals, samplePointDtos);
  }

  async getUsers(
    pagination: PaginationRequestDto,
  ): Promise<PaginationResponseVo<any>> {
    const totals = await this.userService.count();
    const userDtos = await this.userService
      .find({})
      .sort({ _id: 1 })
      .skip(pagination.skip)
      .limit(pagination.size);
    // Logger.debug('skip + size: ' + pagination.size);
    // Logger.debug(userDtos.length);

    return Pagination.of(pagination, totals, userDtos);
  }
  /**
   * ????????????????????????
   * @param createUserDto ??????DTO
   * @returns ??????DTO
   */
  async updateCurrentUser(createUserDto: CreateUserDto) {
    const user = await this.userService.updateCurrentUser(createUserDto);
    // ????????????????????????
    this.cronService.freshUserSubscribe();
    return user;
  }
  /**
   * ?????????????????????
   * @param code ??????Code
   * @returns ??????DTO
   */
  async getCreateCurrentUser(code: string) {
    const body = await this.mpService.login(code);
    return await this.userService.getCreateCurrentUser(body);
  }
  /**
   * ???????????????????????????
   * @param paramData ????????????????????????
   * @returns ???????????????
   */
  async getSample(paramData: any) {
    return await this.samplePointService.getSample(paramData);
  }
}
