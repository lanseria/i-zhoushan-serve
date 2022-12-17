import { Logger, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configSwagger } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.MEDIA_TYPE,
    key: 'v=',
  });
  app.enableCors();
  configSwagger(app);
  await app.listen(AppModule.port);
  return AppModule;
}
bootstrap().then((appModule) => {
  Logger.log(
    `Application running on url: http://localhost:${appModule.port}`,
    'Main',
  );
  Logger.log(
    `Swagger App running on url: http://localhost:${appModule.port}/swagger`,
    'Main',
  );
});
