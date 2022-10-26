import { Body, Controller, Get, Post, Query, Version } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { SampleService } from './sample.service';

@ApiTags('小程序端', '核酸采样服务')
@Controller({
  path: 'mp/sample',
})
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}

  /**
   * 核酸采样点服务跨域转发
   */
  @ApiOperation({ description: '核酸采样点服务跨域转发' })
  @Post('/points')
  @Version('0.1.0')
  getSampleV1(@Body() body) {
    return this.sampleService.getSampleV1(body);
  }

  /**
   * 获取当前用户(如没有则创建)
   */
  @ApiOperation({ description: '获取当前用户(如没有则创建)' })
  @Get('/user')
  getCreateCurrentUser(@Query('code') code: string) {
    return this.sampleService.getCreateCurrentUser(code);
  }

  /**
   * 新建用户
   */
  @ApiOperation({ description: '新建用户' })
  @Post('/user')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.sampleService.createUser(createUserDto);
  }

  /**
   * 获取全部用户
   */
  @ApiOperation({ description: '获取全部用户' })
  @Get('/users')
  findAllUser() {
    return this.sampleService.findAllUser();
  }
}
