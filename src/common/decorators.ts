import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { DefaultPagination } from './interfaces';

/**
 * Decorator intended for building a PaginationRequest object based on the query string parameters
 */
export const PaginationParams = createParamDecorator(
  (
    data: DefaultPagination = {
      defaultSkip: 0,
      defaultPage: 0,
      defaultLimit: 10,
      defaultOrder: {},
      maxAllowedSize: 20,
    },
    ctx: ExecutionContext,
  ) => {
    let {
      // eslint-disable-next-line prefer-const
      query: { skip, current, size, orderBy, orderDirection, ...params },
    } = ctx.switchToHttp().getRequest();

    const {
      defaultSkip,
      defaultPage,
      defaultLimit,
      defaultOrder,
      maxAllowedSize,
    } = data;

    const order = orderBy ? orderBy : defaultOrder;

    size = size && size > 0 ? +size : defaultLimit;

    if (!skip) {
      if (current) {
        skip = (+current - 1) * +size;
        skip = skip >= 0 ? skip : 0;
      } else {
        current = defaultPage;
        skip = defaultSkip;
      }
    } else {
      current = Math.floor(+skip / size);
    }

    size = +size < +maxAllowedSize ? size : maxAllowedSize;
    // Logger.debug('current: ' + current);
    // Logger.debug('size: ' + size);
    return Object.assign(data ? data : {}, {
      skip,
      page: current,
      size,
      order,
      params,
    });
  },
  [
    (target: any, key: string) => {
      // Here it is. Use the `@ApiQuery` decorator purely as a function to define the meta only once here.
      ApiQuery({
        name: 'current',
        schema: { default: 1, type: 'number', minimum: 1 },
        required: false,
      })(target, key, Object.getOwnPropertyDescriptor(target, key));
      ApiQuery({
        name: 'size',
        schema: { default: 10, type: 'number', minimum: 1 },
        required: false,
      })(target, key, Object.getOwnPropertyDescriptor(target, key));
    },
  ],
);
