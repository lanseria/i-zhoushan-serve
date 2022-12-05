import { Module } from '@nestjs/common';
import { ParkingPointModule } from 'src/modules/parking-point/parking-point.module';
import { AllSchemasModule } from 'src/schemas';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';

@Module({
  imports: [AllSchemasModule, ParkingPointModule],
  controllers: [ParkingController],
  providers: [ParkingService],
})
export class ParkingPageModule {}
