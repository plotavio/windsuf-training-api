import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Logger } from '@nestjs/common';

config();

const configService = new ConfigService();
const logger = new Logger('TypeORM');

logger.log('Initializing TypeORM configuration...');
logger.debug(`Host: ${configService.get('DB_HOST')}`);
logger.debug(`Port: ${configService.get('DB_PORT')}`);
logger.debug(`Database: ${configService.get('DB_DATABASE')}`);

export default new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST', 'localhost'),
  port: configService.get('DB_PORT', 3306),
  username: configService.get('DB_USERNAME', 'root'),
  password: configService.get('DB_PASSWORD', ''),
  database: configService.get('DB_DATABASE', 'windsurf-training'),
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  // Logging configuration
  logger: 'advanced-console',
  logging: ['error', 'warn', 'info', 'log', 'migration', 'schema', 'query'],
  maxQueryExecutionTime: 1000, // Log slow queries (>1s)
});
