import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationParams } from 'src/common/decorators';
import {
  CreateUserDto,
  PaginationRequestDto,
  SamplePointProxyDto,
} from 'src/common/dtos';
import { PaginationResponseVo } from 'src/common/interfaces';
import { SampleService } from './sample.service';

@ApiTags('核酸采样服务')
@Controller({
  path: 'sample',
})
export class SampleController {
  constructor(private readonly sampleService: SampleService) {}
  /**
   * 获取全部用户
   */
  @ApiOperation({ description: '获取全部用户' })
  @Get('/users/page')
  getUsers(
    @PaginationParams() pagination: PaginationRequestDto,
  ): Promise<PaginationResponseVo<any>> {
    return this.sampleService.getUsers(pagination);
  }

  /**
   * 获取全部核酸采样点位
   */
  @ApiOperation({ description: '获取全部用户' })
  @Get('/points/page')
  getPoints(
    @PaginationParams() pagination: PaginationRequestDto,
  ): Promise<PaginationResponseVo<any>> {
    return this.sampleService.getPoints(pagination);
  }
  /**
   * 更新当前用户
   */
  @ApiOperation({ description: '更新当前用户' })
  @Put('/user')
  updateCurrentUser(@Body() createUserDto: CreateUserDto) {
    return this.sampleService.updateCurrentUser(createUserDto);
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
   * 核酸采样点服务跨域转发
   */
  @ApiOperation({ description: '核酸采样点服务跨域转发' })
  @Post('/points')
  getSampleV1(@Body() body: SamplePointProxyDto) {
    return this.sampleService.getSample(body);
  }
}
