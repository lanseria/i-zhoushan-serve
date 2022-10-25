import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
// TODO: 可以把这个配置公共化
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
export const TOKEN_NAME = 'access-token';
export const AUTH_OPTIONS: SecuritySchemeObject = {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'Bearer',
};

const title = 'i舟山后端服务';
const description = '用于分享地图信息';

/**
 * Setup swagger in the application
 * @param app {INestApplication}
 */
export const configSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .addBearerAuth(AUTH_OPTIONS, TOKEN_NAME)
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`swagger`, app, document);
};
