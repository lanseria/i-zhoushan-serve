import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationParams } from 'src/common/decorators';
import { FileResponseDto, PaginationResponseDto } from 'src/common/dtos';
import { PaginationRequest } from 'src/common/interfaces';
import { FileService } from './file.service';

@ApiTags('PC端', '文件服务')
@Controller({
  path: 'pc/file',
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
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<FileResponseDto>> {
    return this.fileService.getFilePage(pagination);
  }
}
