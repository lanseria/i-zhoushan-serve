import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SampleService } from './sample.service';

@Controller('pc/sample')
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}
  /**
   * 获取全部用户
   */
  @ApiOperation({ description: '获取全部用户' })
  @Get('/users')
  findAllUser() {
    return this.sampleService.findAllUser();
  }
}
