import { Module, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('DatabaseModule');
        
        logger.log('Initializing database connection...');
        logger.debug(`Host: ${configService.get('DB_HOST')}`);
        logger.debug(`Port: ${configService.get('DB_PORT')}`);
        logger.debug(`Database: ${configService.get('DB_DATABASE')}`);
        
        return {
          type: 'mysql',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get('DB_PORT', 3306),
          username: configService.get('DB_USERNAME', 'root'),
          password: configService.get('DB_PASSWORD', ''),
          database: configService.get('DB_DATABASE', 'windsurf-training'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          migrationsRun: true,
          synchronize: false,
          // Logging configuration
          logger: 'advanced-console',
          logging: ['error', 'warn', 'info', 'log', 'migration', 'schema', 'query'],
          maxQueryExecutionTime: 1000, // Log slow queries (>1s)
          extra: {
            connectionLimit: 10,
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {
  private readonly logger = new Logger('DatabaseModule');

  constructor() {
    this.logger.log('Database module initialized');
  }
}
