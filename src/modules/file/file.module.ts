import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';
import { FileService } from './file.service';

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const cfg = {
          endPoint: configService.get<string>('minio.host'),
          port: +configService.get<string>('minio.port'),
          useSSL: false,
          accessKey: configService.get<string>('minio.user'),
          secretKey: configService.get<string>('minio.pass'),
        };
        Logger.debug(JSON.stringify(cfg), 'FileModule');
        return cfg;
      },
      inject: [ConfigService],
    }),
  ],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
