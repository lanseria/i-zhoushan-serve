import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';

const defaultConnection = (
  config: ConfigService,
): MongooseModuleFactoryOptions => {
  const uri = `mongodb://${config.get<string>(
    'database.user',
  )}:${config.get<string>('database.pass')}@${config.get<string>(
    'database.host',
  )}:${config.get<string>('database.port')}`;
  Logger.debug(uri, 'DatabaseProviders');
  return {
    uri,
  };
};

export const databaseProviders = [
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: defaultConnection,
    inject: [ConfigService],
  }),
];
