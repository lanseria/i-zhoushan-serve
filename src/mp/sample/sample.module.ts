import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { MpService } from '../mp.service';
import { SampleController } from './sample.controller';
import { SampleService } from './sample.service';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    FileModule,
  ],
  controllers: [SampleController],
  providers: [SampleService, MpService],
})
export class SampleModule {}
