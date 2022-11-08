import { Module } from '@nestjs/common';
import { SampleController } from './sample.controller';
import { SampleService } from './sample.service';
import { FileModule } from 'src/modules/file/file.module';
import { UserModule } from 'src/modules/user/user.module';
import { AllSchemasModule } from 'src/schemas';
import { SamplePointModule } from 'src/modules/sample-point/sample-point.module';
import { GotModule } from 'src/modules/got/got.module';
import { CronModule } from 'src/modules/cron/cron.module';
import { MpModule } from 'src/modules/mp/mp.module';

@Module({
  imports: [
    AllSchemasModule,
    UserModule,
    FileModule,
    SamplePointModule,
    GotModule,
    CronModule,
    MpModule,
  ],
  controllers: [SampleController],
  providers: [SampleService],
})
export class SamplePageModule {}
