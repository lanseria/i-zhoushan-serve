import { Module } from '@nestjs/common';
import { MpController } from './mp.controller';
import { MpService } from './mp.service';
import { FileModule as MinioFileModule } from 'src/modules/file/file.module';

@Module({
  imports: [MinioFileModule],
  controllers: [MpController],
  providers: [MpService],
  exports: [MpService],
})
export class MpModule {}
