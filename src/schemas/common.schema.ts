import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class PointLocation extends Document {
  @Prop({ required: true, type: String, enum: ['Point'] })
  type: string;

  @Prop({ required: true, type: [Number] })
  coordinates: [number, number];
}
