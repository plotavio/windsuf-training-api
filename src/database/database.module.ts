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
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
       
        synchronize:false,
        logging: true,
        migrationsRun: true,
        cli: {
          migrationsDir: 'migrations',
        },
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          
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
