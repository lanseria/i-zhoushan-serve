export interface PaginationResponseVo<T> {
  current: number;
  skippedRecords: number;
  pages: number;
  hasNext: boolean;
  records: T[];
  payloadSize: number;
  total: number;
}

export interface FileResponseVo {
  name: string; //	对象名称。

  prefix: string; //对象名称的前缀。

  size: number; //对象的大小。

  etag: string; //对象的etag值。

  lastModified: Date; //最后修改时间。
}
/**
 * Interface designed to assign default parameters to pagination
 */
export interface DefaultPagination {
  defaultSkip?: number;
  defaultPage?: number;
  defaultLimit?: number;
  defaultOrder?: any;
  defaultOrderDirection?: string;
  maxAllowedSize?: number;
}

export type AppMimeType = 'image/png' | 'image/jpeg';

export interface BufferedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: AppMimeType;
  size: number;
  buffer: Buffer | string;
}

export interface ProxySamplePoint {
  orgId: string;
  orgName: string;
  areaCode: string;
  areaName: string;
  address: string;
  gisLng: string;
  gisLat: string;
  phone: string;
  workTime: string;
  levelName: string;
  orgType: number;
  serviceStatus: number;
  distanceHospital: number;
  isFree: number;
  isFever: number;
  isNeedHs: number;
  isRed: number;
  isYellow: number;
}
