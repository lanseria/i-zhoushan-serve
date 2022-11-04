/**
 * Interface intended for requesting results paginated
 */
export interface PaginationRequest {
  // Number of records to skip (where the pagination shall start)
  skip: number;
  /**
   * The index of the page where the pagination should start from.
   *
   * Its intended for the same purpose that `skip`, but the latter represents an amount of
   * records that should be skipped.
   *
   * Should be used only when needed to handle the pagination by the current page index.
   */
  page?: number;

  // Page size
  limit: number;

  // Sort order
  order?: { [field: string]: 'ASC' | 'DESC' };

  // Other params of type T
  params?: any;
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
