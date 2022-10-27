import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MpService } from '../mp.service';
import { SampleController } from './sample.controller';
import { SampleService } from './sample.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [SampleController],
  providers: [SampleService, MpService],
})
export class SampleModule {}
