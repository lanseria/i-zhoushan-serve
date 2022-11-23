import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import * as turf from '@turf/turf';
import { CreateUserDto, PaginationRequestDto } from '../../common/dtos';
import { UserService } from 'src/modules/user/user.service';
import { SamplePointService } from 'src/modules/sample-point/sample-point.service';
import { CronService } from 'src/modules/cron/cron.service';
import { MpService } from 'src/modules/mp/mp.service';
import { Pagination } from 'src/common/helper';
import { PaginationResponseVo } from 'src/common/interfaces';

@Injectable()
export class SampleService {
  constructor(
    private cronService: CronService,
    private mpService: MpService,
    private userService: UserService,
    private samplePointService: SamplePointService,
  ) {}

  private readonly logger = new Logger(SampleService.name);

  async getPointsMap(): Promise<any> {
    // const totals = await this.samplePointService.count();
    const samplePointDtos = await this.samplePointService
      .find({})
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
   * 更新当前用户信息
   * @param createUserDto 用户DTO
   * @returns 用户DTO
   */
  async updateCurrentUser(createUserDto: CreateUserDto) {
    const user = await this.userService.updateCurrentUser(createUserDto);
    // 刷新用户订阅服务
    this.cronService.freshUserSubscribe();
    return user;
  }
  /**
   * 获取并创建用户
   * @param code 用户Code
   * @returns 用户DTO
   */
  async getCreateCurrentUser(code: string) {
    const body = await this.mpService.login(code);
    return await this.userService.getCreateCurrentUser(body);
  }
  /**
   * 转发代理核酸采样点
   * @param paramData 用户地理位置信息
   * @returns 核酸采样点
   */
  async getSample(paramData: any) {
    return await this.samplePointService.getSample(paramData);
  }
}
