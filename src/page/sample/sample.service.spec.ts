import { CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../../database/database.module';
import { configConfiguration } from '../../config';
import { FileModule } from '../../modules/file/file.module';
import {
  SamplePoint,
  SamplePointSchema,
} from '../../schemas/samplePoint.schema';
import { User, UserSchema } from '../../schemas/user.schema';
import { SampleService } from './sample.service';
import { MpService } from '../mp.service';

describe('SampleService', () => {
  let service: SampleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // MongooseModule.forRoot('mongodb://localhost/nest'),
        ConfigModule.forRoot({
          envFilePath: [
            '.env.production.local',
            '.env.development.local',
            '.env',
          ],
          isGlobal: true,
          load: [configConfiguration],
        }),
        ScheduleModule.forRoot(),
        DatabaseModule,
        CacheModule.register({
          isGlobal: true,
        }),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
          {
            name: SamplePoint.name,
            schema: SamplePointSchema,
          },
        ]),
        FileModule,
      ],
      providers: [SampleService, MpService],
    }).compile();

    service = module.get<SampleService>(SampleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('测试同步采样点数据', async () => {
    const data = [
      {
        orgId: '1',
        orgName: '金平西岙',
        areaCode: '330922',
        areaName: '舟山市嵊泗县菜园镇22222',
        address: '嵊泗县菜园镇金平西岙',
        gisLng: '122.451266',
        gisLat: '30.747641',
        gmtUpdate: null,
        phone: null,
        workTime: '周一至周日(07:30-11:00,14:30-17:00);(含法定节假日)',
        levelName: '重点公共场所',
        orgType: 1,
        serviceStatus: 2,
        distanceHospital: 0,
        videoUrl: null,
        dynamicVideoUrl: null,
        isFree: 0,
        isFever: 0,
        isNeedHs: 0,
        isRed: 0,
        isYellow: 0,
      },
    ];
    await service.proxyToSchema(data);
  });
});
