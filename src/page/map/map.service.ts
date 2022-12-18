import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(MapService.name);

  async createMapFeatures(body: FeatureDto) {
    const mapFeature = new this.mapFeaturesModel(body);
    return await mapFeature.save();
  }

  async updateMapFeatures(body: FeatureDto) {
    const mapFeature = await this.mapFeaturesModel.findOneAndUpdate(
      { id: body.id },
      {
        $set: {
          properties: body.properties,
        },
      },
    );
    return mapFeature;
  }

  async deleteMapFeature(id: string) {
    const mapFeature = await this.mapFeaturesModel.findOneAndDelete({
      id,
    });
    return mapFeature;
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
        geometry: {
          $geoWithin: {
            $geometry: bboxPolygon.geometry,
          },
        },
      })
      .sort({ _id: 1 });
    return mapFeatures;
  }
}
