import { Module } from '@nestjs/common';
import { AllSchemasModule } from 'src/schemas';
import { GotModule } from '../got/got.module';
import { ParkingPointService } from './parking-point.service';

@Module({
  imports: [AllSchemasModule, GotModule],
  providers: [ParkingPointService],
  exports: [ParkingPointService],
})
export class ParkingPointModule {}
