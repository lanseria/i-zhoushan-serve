import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class PointLocation extends Document {
  @Prop({ required: true, type: String, enum: ['Point'] })
  type: string;

  @Prop({ required: true, type: [Number] })
  coordinates: [number, number];
}

@Schema({
  timestamps: {
    currentTime: () => Math.floor(Date.now() / 1000),
  },
})
export class SamplePoint extends Document {
  @Prop({ required: true, type: String, unique: true })
  orgId: string;

  @Prop({ required: true, type: String })
  orgName: string;

  @Prop({ required: true, type: String })
  areaCode: string;

  @Prop({ required: true, type: String })
  areaName: string;

  @Prop({ required: true, type: String })
  address: string;

  @Prop({ required: false, type: String })
  phone: string;

  @Prop({ required: true, type: PointLocation })
  location: PointLocation;

  @Prop({ required: true, type: String })
  workTime: string;

  @Prop({ required: true, type: String })
  levelName: string;

  @Prop({ required: true, type: Number, enum: [1] })
  orgType: number;

  /**
   * 0拥挤
   * 1忙碌
   * 2空闲
   * 3休息
   */
  @Prop({ required: false, type: Number, enum: [0, 1, 2, 3] })
  serviceStatus?: number;

  @Prop({ required: true, type: Number })
  distanceHospital: number;

  @Prop({ required: true, type: Number })
  isFree: number;

  @Prop({ required: true, type: Number })
  isFever: number;

  @Prop({ required: true, type: Number })
  isNeedHs: number;

  @Prop({ required: true, type: Number })
  isRed: number;

  @Prop({ required: true, type: Number })
  isYellow: number;

  @Prop({ type: Number })
  createdAt: number;

  @Prop({ type: Number })
  updatedAt: number;
}

export type SamplePointDocument = SamplePoint & Document;

export const SamplePointSchema = SchemaFactory.createForClass(SamplePoint);
