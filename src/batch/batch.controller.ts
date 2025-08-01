import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put, HttpCode, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BatchService } from './batch.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Batch } from './batch.entity';

@ApiTags('batch')
@Controller('batch')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new batch with bigbags' })
  @ApiResponse({ status: 201, description: 'The batch and its bigbags have been successfully created.', type: Batch })
  async create(@Body() createBatchDto: CreateBatchDto) {
    return this.batchService.create(createBatchDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all batches' })
  @ApiResponse({ status: 200, description: 'Returns all batches.', type: [Batch] })
  async findAll() {
    return this.batchService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('deleted')
  @ApiOperation({ summary: 'Get all deleted batches' })
  @ApiResponse({ status: 200, description: 'Returns all deleted batches.', type: [Batch] })
  async findDeleted() {
    return this.batchService.findDeleted();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a batch by ID' })
  @ApiResponse({ status: 200, description: 'Returns the requested batch.', type: Batch })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.batchService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a batch and its bigbags' })
  @ApiResponse({ status: 200, description: 'The batch and its bigbags have been successfully updated.', type: Batch })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBatchDto: UpdateBatchDto,
  ) {
    return this.batchService.update(id, updateBatchDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a batch' })
  @ApiResponse({ status: 200, description: 'The batch has been successfully deleted.' })
  remove(@Param('id') id: number) {
    return this.batchService.remove(id);
  }
}
