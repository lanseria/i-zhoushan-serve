import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PointLocation } from './common.schema';

@Schema({
  timestamps: {
    currentTime: () => Math.floor(Date.now() / 1000),
  },
})
export class ParkingPoint extends Document {
  @Prop({ required: true, type: String, default: '' })
  name: string;

  @Prop({ required: true, type: String, default: '' })
  address: string;
  /**
   * WGS84
   */
  @Prop({ required: true, type: PointLocation })
  location: PointLocation;
  /**
   * 分享质量（1高2中3低）
   */
  @Prop({ required: true, type: String, default: '' })
  quality: string;
  /**
   * 是否免费（不免费的话如何收费）
   */
  @Prop({ required: true, type: String, default: '' })
  isFree: string;

  @Prop({ type: Number })
  createdAt: number;

  @Prop({ type: Number })
  updatedAt: number;
}

export type ParkingPointDocument = ParkingPoint & Document;

export const ParkingPointSchema = SchemaFactory.createForClass(ParkingPoint);
