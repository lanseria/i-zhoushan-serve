import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configConfiguration } from './config';
import { SampleModule } from './sample/sample.module';
import { MpModule } from './mp/mp.module';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://localhost/nest'),
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env'],
      isGlobal: true,
      load: [configConfiguration],
    }),
    SampleModule,
    MpModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number;
  constructor(private readonly configService: ConfigService) {
    AppModule.port = +this.configService.get('API_PORT');
  }
}
