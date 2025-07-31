import { Controller, Get, Post, Body, Param, UseGuards, Req, Patch, Delete } from '@nestjs/common';
import { BigbagService } from './bigbag.service';
import { CreateBigbagDto } from './dto/create-bigbag.dto';
import { UpdateBigbagDto } from './dto/update-bigbag.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bigbag')
export class BigbagController {
  constructor(private readonly bigbagService: BigbagService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBigbagDto: CreateBigbagDto) {
    return this.bigbagService.create(createBigbagDto);
  }

  @Get()
  findAll() {
    return this.bigbagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bigbagService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBigbagDto: UpdateBigbagDto) {
    return this.bigbagService.update(+id, updateBigbagDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bigbagService.remove(+id);
  }
}
