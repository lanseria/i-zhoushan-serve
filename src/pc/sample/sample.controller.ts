import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SampleService } from './sample.service';
import { PaginationParams } from 'src/common/decorators';
import { PaginationRequestDto } from 'src/common/dtos';
import { PaginationResponseVo } from 'src/common/interfaces';
@ApiTags('PC端', '核酸采样服务')
@Controller({
  path: 'pc/sample',
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
}
