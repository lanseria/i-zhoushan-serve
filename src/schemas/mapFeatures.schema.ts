import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Geometries } from '@turf/turf';
import { Document } from 'mongoose';

@Schema({
  timestamps: {
    currentTime: () => Math.floor(Date.now() / 1000),
  },
})
export class MapFeatures extends Document {
  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  id: string;

  @Prop({
    required: true,
    type: String,
    default: 'Feature',
  })
  type: string;

  @Prop({
    required: true,
    type: Object,
  })
  geometry: Geometries;

  @Prop({
    required: true,
    type: Object,
  })
  properties: object;
}

export type MapFeaturesDocument = MapFeatures & Document;

export const MapFeaturesSchema = SchemaFactory.createForClass(MapFeatures);
