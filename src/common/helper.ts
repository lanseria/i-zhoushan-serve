import { PaginationRequestDto } from './dtos';
import { PaginationResponseVo } from './interfaces';

export class Pagination {
  /**
   * Return pagination response
   * @param PaginationRequest {PaginationRequest}
   * @param total {number}
   * @param dtos {t[]}
   * @returns {PaginationResponseDto}
   */
  static of<T>(
    { size, current, skip }: PaginationRequestDto,
    total: number,
    dtos: T[],
  ): PaginationResponseVo<T> {
    const pages = Math.floor(total / size) + (total % size > 0 ? 1 : 0);
    current = +current > 0 ? +current : 1;
    const hasNext = current <= pages - 1;

    return {
      pages: pages,
      payloadSize: dtos.length,
      hasNext: hasNext,
      records: dtos,
      current: current,
      skippedRecords: skip,
      total: total,
    };
  }
}
