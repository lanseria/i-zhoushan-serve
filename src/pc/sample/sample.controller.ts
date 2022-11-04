import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SampleService } from './sample.service';
import { PaginationParams } from 'src/common/decorators';
import { PaginationRequest } from 'src/common/interfaces';
import { PaginationResponseDto } from 'src/common/dtos';
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
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<any>> {
    return this.sampleService.getUsers(pagination);
  }
}
