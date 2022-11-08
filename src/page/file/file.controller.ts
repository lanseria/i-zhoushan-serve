import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationParams } from 'src/common/decorators';
import { PaginationRequestDto } from 'src/common/dtos';
import { FileResponseVo, PaginationResponseVo } from 'src/common/interfaces';

import { FileService } from './file.service';

@ApiTags('文件服务')
@Controller({
  path: 'file',
})
export class FileController {
  constructor(private fileService: FileService) {}

  /**
   * 获取文件分页
   * @returns
   */
  @ApiOperation({
    description: '文件管理分页',
  })
  @Get('page')
  async getFilePage(
    @PaginationParams() pagination: PaginationRequestDto,
  ): Promise<PaginationResponseVo<FileResponseVo>> {
    return this.fileService.getFilePage(pagination);
  }
}
