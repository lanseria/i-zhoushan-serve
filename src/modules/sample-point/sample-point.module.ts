import { Module } from '@nestjs/common';
import { AllSchemasModule } from 'src/schemas';
import { GotModule } from '../got/got.module';
import { GotService } from '../got/got.service';
import { SamplePointService } from './sample-point.service';

@Module({
  imports: [AllSchemasModule, GotModule],
  providers: [SamplePointService],
  exports: [SamplePointService],
})
export class SamplePointModule {}
