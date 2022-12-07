import { Body, Controller, Logger, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Feature, Point } from '@turf/turf';
import { LocationBounds } from 'src/common/dtos';
import { ParkingService } from './parking.service';

@ApiTags('停车点服务')
@Controller('parking')
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}
  private readonly logger = new Logger(ParkingController.name);
  /**
   * 更新上传全部停车点位For地图
   */
  @ApiOperation({ description: '更新上传全部停车点位For地图' })
  @Put('/points/map')
  updatePointsForMap(@Body() body: Feature<Point>[]): Promise<any> {
    // this.logger.debug(body);
    return this.parkingService.updatePointsForMap(body);
  }
  /**
   * 获取全部停车点位For地图
   */
  @ApiOperation({ description: '获取全部停车点位For地图' })
  @Post('/points/map')
  getPointsForMap(@Body() body: LocationBounds): Promise<any> {
    // this.logger.debug(body);
    return this.parkingService.getPointsMap(body);
  }
}
