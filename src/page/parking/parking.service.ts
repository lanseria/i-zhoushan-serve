import { Injectable } from '@nestjs/common';
import { LocationBounds } from 'src/common/dtos';
import * as turf from '@turf/turf';
import { ParkingPointService } from 'src/modules/parking-point/parking-point.service';
import { Feature, Point } from '@turf/turf';

@Injectable()
export class ParkingService {
  constructor(private parkingPointService: ParkingPointService) {}

  async updatePointsForMap(body: Feature<Point>[]): Promise<any> {
    return this.parkingPointService.proxyToSchema(body);
  }

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
    const parkingPointDtos = await this.parkingPointService
      .find({
        location: {
          $geoWithin: {
            $geometry: bboxPolygon.geometry,
          },
        },
      })
      .sort({ _id: 1 });

    const pointList = parkingPointDtos.map((item) => {
      return turf.point(item.location.coordinates, {
        _id: item._id,
        isFree: item.isFree,
      });
    });
    return pointList;
  }
}
