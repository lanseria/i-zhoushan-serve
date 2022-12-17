import { ApiProperty } from '@nestjs/swagger';
import { Geometries } from '@turf/turf';
/**
 * Interface intended for requesting results paginated
 */
export class PaginationRequestDto {
  // Number of records to skip (where the pagination shall start)
  @ApiProperty({ example: 0 })
  skip: number;
  /**
   * The index of the page where the pagination should start from.
   *
   * Its intended for the same purpose that `skip`, but the latter represents an amount of
   * records that should be skipped.
   *
   * Should be used only when needed to handle the pagination by the current page index.
   */
  @ApiProperty({ example: 1 })
  current?: number;

  // Page size
  @ApiProperty({ example: 10 })
  size: number;

  // Sort order
  @ApiProperty({ example: '' })
  order?: { [field: string]: 'ASC' | 'DESC' };

  // Other params of type T
  @ApiProperty({ example: {} })
  params?: any;
}

export class CreateUserDto {
  @ApiProperty({ example: 'jhdh1j3h1jh3jk' })
  openid: string;

  @ApiProperty({ example: false })
  isSubscribe: boolean;

  @ApiProperty({ example: 1610536511 })
  currentSampleDateTime: number;

  @ApiProperty({ example: 3 })
  intervalDay: number;

  @ApiProperty({ example: 1610536590 })
  nextSampleDateTime: number;
}

export class SamplePointProxyDto {
  @ApiProperty({ example: '' })
  orgName: string;
  @ApiProperty({ example: 1 })
  pageNum: number;
  @ApiProperty({ example: 1000 })
  pageSize: number;
  @ApiProperty({ example: '舟山市' })
  areaName: string;
  @ApiProperty({ example: '' })
  levelName: string;
  @ApiProperty({ example: '' })
  serviceStatus: string;
  @ApiProperty({ example: '' })
  gisLat: string;
  @ApiProperty({ example: '' })
  gisLng: string;
  @ApiProperty({ example: '' })
  isFree: string;
  @ApiProperty({ example: '' })
  isRed: string;
  @ApiProperty({ example: '' })
  isYellow: string;
  @ApiProperty({ example: '' })
  isNeedHs: string;
  @ApiProperty({ example: '' })
  isLive: string;
}

export class LocationObj {
  @ApiProperty({ example: 122.89455745090368 })
  lng: number;
  @ApiProperty({ example: 30.384722970650998 })
  lat: number;
}

export class LocationBounds {
  @ApiProperty({
    example: { lng: 122.89455745090368, lat: 30.384722970650998 },
  })
  _ne: LocationObj;
  @ApiProperty({
    example: { lng: 121.43200251926203, lat: 29.618833841204506 },
  })
  _sw: LocationObj;
}

export class FeatureDto {
  @ApiProperty({
    example: '6953c9629da9ee7161905fe27ec33310',
  })
  id: string;
  @ApiProperty({
    example: 'Feature',
  })
  type: string;
  @ApiProperty({
    example: {
      coordinates: [122.116247886086, 30.02189049955696],
      type: 'Point',
    },
  })
  geometry: Geometries;
  @ApiProperty({
    example: {
      center: '[122.116247886086,30.02189049955696]',
      'icon-image': '点Icon',
      'icon-size': 0.3,
      id: 'lRdb25pg9eLim5OgbWEpN',
      type: 'InitPoint',
    },
  })
  properties: any;
}
