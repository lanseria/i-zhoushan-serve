import { Module } from '@nestjs/common';
import { AllSchemasModule } from 'src/schemas';
import { UserService } from './user.service';

@Module({
  imports: [AllSchemasModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
