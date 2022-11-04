import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileModule as MinioFileModule } from '../../file/file.module';

@Module({
  imports: [MinioFileModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
