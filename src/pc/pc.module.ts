import { Module } from '@nestjs/common';
import { PcController } from './pc.controller';
import { PcService } from './pc.service';
import { SampleModule } from './sample/sample.module';
import { ParkingModule } from './parking/parking.module';
import { UserModule } from './user/user.module';

@Module({
  controllers: [PcController],
  providers: [PcService],
  imports: [SampleModule, ParkingModule, UserModule]
})
export class PcModule {}
