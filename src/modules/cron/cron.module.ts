import { Module } from '@nestjs/common';
import { MpModule } from 'src/modules/mp/mp.module';
import { UserModule } from '../user/user.module';
import { CronService } from './cron.service';

@Module({
  imports: [UserModule, MpModule],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
