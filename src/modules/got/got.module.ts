import { Module } from '@nestjs/common';
import { GotService } from './got.service';

@Module({
  providers: [GotService],
  exports: [GotService],
})
export class GotModule {}
