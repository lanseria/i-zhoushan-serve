import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SamplePoint, SamplePointSchema } from 'src/schemas/samplePoint.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { SampleController } from './sample.controller';
import { SampleService } from './sample.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: SamplePoint.name,
        schema: SamplePointSchema,
      },
    ]),
  ],
  controllers: [SampleController],
  providers: [SampleService],
})
export class SampleModule {}
