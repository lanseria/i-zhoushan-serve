import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Feature } from '@turf/turf';
import * as turf from '@turf/turf';
import { Model } from 'mongoose';
import { FeatureDto, LocationBounds } from 'src/common/dtos';
import { MapFeaturesDocument } from 'src/schemas/mapFeatures.schema';

@Injectable()
export class MapService {
  constructor(
    @InjectModel('MapFeatures')
    private mapFeaturesModel: Model<MapFeaturesDocument>,
  ) {}

  async createMapFeatures(body: FeatureDto) {
    const mapFeature = new this.mapFeaturesModel(body);
    return await mapFeature.save();
  }

  async updateMapFeatures(body: FeatureDto) {
    const mapFeature = new this.mapFeaturesModel(body);
    return await mapFeature.update();
  }

  async queryMapFeatures(body: LocationBounds) {
    const bboxPolygon = turf.bboxPolygon(
      turf.bbox(
        turf.multiPoint([
          [body._ne.lng, body._ne.lat],
          [body._sw.lng, body._sw.lat],
        ]),
      ),
    );
    const mapFeatures = await this.mapFeaturesModel
      .find({
        location: {
          $geoWithin: {
            $geometry: bboxPolygon.geometry,
          },
        },
      })
      .sort({ _id: 1 });
    return mapFeatures;
  }
}
