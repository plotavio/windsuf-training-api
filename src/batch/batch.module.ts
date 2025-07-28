import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { Batch } from './batch.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Batch, User])],
  controllers: [BatchController],
  providers: [BatchService],
  exports: [BatchService],
})
export class BatchModule {}
