import { Module } from '@nestjs/common';
import { MpController } from './mp.controller';
import { MpService } from './mp.service';
import { SampleModule } from './sample/sample.module';
import { ParkingModule } from './parking/parking.module';

@Module({
  imports: [SampleModule, ParkingModule],
  controllers: [MpController],
  providers: [MpService],
})
export class MpModule {}
