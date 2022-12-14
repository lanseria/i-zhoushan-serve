import { Module } from '@nestjs/common';
import { AllSchemasModule } from 'src/schemas';
import { GotModule } from '../got/got.module';
import { SamplePointService } from './sample-point.service';

@Module({
  imports: [AllSchemasModule, GotModule],
  providers: [SamplePointService],
  exports: [SamplePointService],
})
export class SamplePointModule {}
