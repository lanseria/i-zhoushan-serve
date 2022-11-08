import { Test, TestingModule } from '@nestjs/testing';
import { SamplePointService } from './sample-point.service';

describe('SamplePointService', () => {
  let service: SamplePointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SamplePointService],
    }).compile();

    service = module.get<SamplePointService>(SamplePointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
