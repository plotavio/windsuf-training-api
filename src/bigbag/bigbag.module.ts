import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bigbag } from './bigbag.entity';
import { BigbagService } from './bigbag.service';
import { BigbagController } from './bigbag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bigbag])],
  controllers: [BigbagController],
  providers: [BigbagService],
})
export class BigbagModule {}
