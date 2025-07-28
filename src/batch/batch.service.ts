import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Batch } from './batch.entity';
import { CreateBatchDto } from './dto/create-batch.dto';

@Injectable()
export class BatchService {
  constructor(
    @InjectRepository(Batch)
    private batchRepository: Repository<Batch>,
  ) {}

  async create(createBatchDto: CreateBatchDto): Promise<Batch> {
    try {
      const batch = this.batchRepository.create(createBatchDto);
      return this.batchRepository.save(batch);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Batch number already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<Batch[]> {
    return this.batchRepository.find({
      relations: ['createdByUser'],
      where: { deletedAt: IsNull() },
      select: ['id', 'batchNumber', 'createdAt', 'createdByUserId', 'deletedAt']
    });
  }

  async findOne(id: number): Promise<Batch> {
    const batch = await this.batchRepository.createQueryBuilder('batch')
      .leftJoinAndSelect('batch.createdByUser', 'createdByUser')
      .where('batch.id = :id', { id })
      .andWhere('batch.deletedAt IS NULL')
      .getOne();

    if (!batch) {
      throw new NotFoundException(`Batch with ID ${id} not found`);
    }
    return batch;
  }

  async update(id: number, createBatchDto: CreateBatchDto): Promise<Batch> {
    const batch = await this.findOne(id);
    Object.assign(batch, createBatchDto);
    return this.batchRepository.save(batch);
  }

  async remove(id: number): Promise<void> {
    const batch = await this.findOne(id);
    batch.deletedAt = new Date();
    await this.batchRepository.save(batch);
  }

  async findDeleted(): Promise<Batch[]> {
    return this.batchRepository.find({
      relations: ['createdByUser'],
      where: { deletedAt: Not(IsNull()) },
      select: ['id', 'batchNumber', 'createdAt', 'createdByUserId', 'deletedAt']
    });
  }
}
