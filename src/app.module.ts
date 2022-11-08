import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configConfiguration } from './config';
import { MpModule } from './modules/mp/mp.module';
import { DatabaseModule } from './database/database.module';
import { FileModule } from './modules/file/file.module';
import { UserModule } from './modules/user/user.module';
import { SamplePointModule } from './modules/sample-point/sample-point.module';
import { GotModule } from './modules/got/got.module';
import { CronModule } from './modules/cron/cron.module';
import { SamplePageModule } from './page/sample/sample.module';
import { ParkingPageModule } from './page/parking/parking.module';
import { UserPageModule } from './page/user/user.module';
import { FilePageModule } from './page/file/file.module';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://localhost/nest'),
    ConfigModule.forRoot({
      envFilePath: ['.env.production.local', '.env.development.local', '.env'],
      isGlobal: true,
      load: [configConfiguration],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    CacheModule.register({
      isGlobal: true,
    }),
    MpModule,
    FileModule,
    UserModule,
    SamplePointModule,
    GotModule,
    CronModule,
    SamplePageModule,
    ParkingPageModule,
    UserPageModule,
    FilePageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static port: number;
  constructor(private readonly configService: ConfigService) {
    AppModule.port = +this.configService.get<string>('api.port');
  }
}
