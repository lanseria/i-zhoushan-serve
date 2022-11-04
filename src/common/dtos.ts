import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  @ApiProperty({ example: 1 })
  current: number;
  @ApiProperty({ example: 0 })
  skippedRecords: number;
  @ApiProperty({ example: 2 })
  pages: number;
  @ApiProperty({ example: true })
  hasNext: boolean;
  @ApiProperty()
  records: T[];
  @ApiProperty({ example: 5 })
  payloadSize: number;
  @ApiProperty({ example: 9 })
  total: number;
}

export class FileResponseDto {
  @ApiProperty()
  name: string; //	对象名称。

  @ApiProperty()
  prefix: string; //对象名称的前缀。

  @ApiProperty()
  size: number; //对象的大小。

  @ApiProperty()
  etag: string; //对象的etag值。

  @ApiProperty()
  lastModified: Date; //最后修改时间。
}
