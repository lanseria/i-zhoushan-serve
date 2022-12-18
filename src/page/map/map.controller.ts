import {
  Body,
  Controller,
  Delete,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Feature } from '@turf/turf';
import { FeatureDto, LocationBounds } from 'src/common/dtos';
import { MapService } from './map.service';

@ApiTags('地图服务')
@Controller({
  path: 'map',
})
export class MapController {
  constructor(private readonly mapService: MapService) {}
  private readonly logger = new Logger(MapController.name);

  @ApiOperation({ description: '上传地图' })
  @Post('/features')
  createMapFeatures(@Body() body: FeatureDto) {
    return this.mapService.createMapFeatures(body);
  }

  @ApiOperation({ description: '更新地图' })
  @Put('/features')
  updateMapFeatures(@Body() body: FeatureDto) {
    return this.mapService.updateMapFeatures(body);
  }

  @ApiOperation({ description: '删除地图' })
  @Delete('/features/:id')
  deleteMapFeature(@Param('id') id: string) {
    return this.mapService.deleteMapFeature(id);
  }

  @ApiOperation({ description: '获取地图' })
  @Post('/featuresbounds')
  queryMapFeatures(@Body() body: LocationBounds) {
    return this.mapService.queryMapFeatures(body);
  }
}
