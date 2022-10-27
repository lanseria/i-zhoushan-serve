import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configConfiguration } from './config';
import { MpModule } from './mp/mp.module';
import { DatabaseModule } from './database/database.module';

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
