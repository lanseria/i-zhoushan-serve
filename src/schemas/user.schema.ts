import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  age: number;

  @Prop()
  openid: string;

  @Prop([String])
  tags: string[];

  @Prop()
  isSubscribe: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
