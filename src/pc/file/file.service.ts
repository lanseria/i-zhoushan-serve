import { Injectable } from '@nestjs/common';
import { Pagination } from 'src/common/helper';
import { PaginationRequest } from 'src/common/interfaces';
import { FileService as MinioFileService } from '../../file/file.service';

@Injectable()
export class FileService {
  constructor(private minioFileService: MinioFileService) {}
  /**
   * 获取图片分页
   */
  async getFilePage(pagination: PaginationRequest) {
    const [files, total] = await this.minioFileService.getFilesAndCount(
      pagination,
    );
    return Pagination.of(pagination, total, files);
  }
}
