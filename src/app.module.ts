import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { SampleModule } from './sample/sample.module';
import { MpModule } from './mp/mp.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env'],
      isGlobal: true,
      load: [configuration],
    }),
    SampleModule,
    MpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
