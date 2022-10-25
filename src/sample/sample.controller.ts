import { Body, Controller, Post, Version } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SampleService } from './sample.service';

@Controller({
  path: 'sample',
})
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  @Post('/points')
  @Version('0.1.0')
  getSampleV1(@Body() body) {
    return this.sampleService.getSampleV1(body);
  }
}
