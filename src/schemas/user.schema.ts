import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  timestamps: {
    currentTime: () => Math.floor(Date.now() / 1000),
  },
})
export class User extends Document {
  @Prop({ required: true, type: String, unique: true })
  openid: string;

  @Prop({ required: true, type: Boolean })
  isSubscribe: boolean;

  @Prop({ type: Number })
  createdAt: number;

  @Prop({ type: Number })
  updatedAt: number;

  @Prop({ required: true, type: Number })
  currentSampleDateTime: number;

  @Prop({ required: true, type: Number })
  intervalDay: number;

  @Prop({ required: true, type: Number })
  nextSampleDateTime: number;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
