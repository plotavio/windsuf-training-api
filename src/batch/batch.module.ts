import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { Batch } from './batch.entity';
import { User } from '../user/user.entity';
import { Bigbag } from '../bigbag/bigbag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Batch, User, Bigbag])],
  controllers: [BatchController],
  providers: [BatchService],
  exports: [BatchService],
})
export class BatchModule {}
