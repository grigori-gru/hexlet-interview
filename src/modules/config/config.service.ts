import * as dotenv from 'dotenv';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export interface MailParams {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
  requireTLS: boolean;
  fromMail: string;
}

export class ConfigService {
  constructor() {
    if (process.env.NODE_ENV !== 'production') {
      const env = process.env.NODE_ENV || 'development';
      const envFileName = env === 'production' ? undefined : `${env}.env`;
      const envFilePath = join(__dirname, '../../..', envFileName);
      dotenv.config({ path: envFilePath });
    }
  }

  get mailParams(): MailParams {
    return {
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      pass: process.env.MAIL_AUTH_PASSWORD,
      user: process.env.MAIL_AUTH_USER,
      secure: process.env.MAIL_SECURE === 'true',
      requireTLS: process.env.MAIL_SECURE === 'true',
      fromMail: process.env.MAIL_FROM,
    };
  }

  get(key: string): string {
    return process.env[key];
  }

  get dbParams(): TypeOrmModuleOptions {
    const env = process.env.NODE_ENV || 'development';

    const commonOptions = {
      synchronize: false,
      entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
      migrationsRun: true,
      migrations: [`${__dirname}/../../db/migrations/**/*{.ts,.js}`],
      cli: {
        migrationsDir: 'src/db/migrations',
      },
      keepConnectionAlive: true,
      logging: !!process.env.DB_LOGGING,
    };

    const test: TypeOrmModuleOptions = {
      type: 'postgres',
      host: 'localhost',
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ...commonOptions,
    };

    const development: TypeOrmModuleOptions = {
      type: 'postgres',
      host: 'localhost',
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ...commonOptions,
    };

    const production: TypeOrmModuleOptions = {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      logging: true,
      ...commonOptions,
    };

    const configs: { [key: string]: TypeOrmModuleOptions } = {
      development,
      test,
      production,
    };

    return configs[env];
  }
}
