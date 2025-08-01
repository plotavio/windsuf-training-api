import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull, DataSource } from 'typeorm';
import { Batch } from './batch.entity';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { Bigbag } from '../bigbag/bigbag.entity';

@Injectable()
export class BatchService {
  constructor(
    @InjectRepository(Batch)
    private batchRepository: Repository<Batch>,
    @InjectRepository(Bigbag)
    private bigbagRepository: Repository<Bigbag>,
    private dataSource: DataSource,
  ) {}

  async create(createBatchDto: CreateBatchDto): Promise<Batch> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Extract bigbags data and remove it from the DTO
      const { bigbags, ...batchData } = createBatchDto;
      
      // Create and save the batch
      const batch = this.batchRepository.create(batchData);
      const savedBatch = await queryRunner.manager.save(batch);

      // Create and save bigbags if they exist
      if (bigbags && bigbags.length > 0) {
        const bigbagEntities = bigbags.map(bigbagData => ({
          ...bigbagData,
          batchId: savedBatch.id,
          createdByUserId: savedBatch.createdByUserId,
        }));
        
        await queryRunner.manager.save(Bigbag, bigbagEntities);
      }

      await queryRunner.commitTransaction();
      return savedBatch;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Batch number already exists');
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Batch[]> {
    return this.batchRepository.find({
      relations: ['createdByUser', 'bigbags'],
      order: {
        id: 'DESC',
        bigbags: {
          id: 'ASC'
        }
      }
    });
  }

  async findOne(id: number): Promise<Batch> {
    const batch = await this.batchRepository.findOne({
      where: { id },
      relations: ['createdByUser', 'bigbags'],
      order: {
        bigbags: {
          id: 'ASC'
        }
      }
    });

    if (!batch) {
      throw new NotFoundException(`Batch with ID ${id} not found`);
    }
    return batch;
  }

  async update(id: number, updateBatchDto: UpdateBatchDto): Promise<Batch> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Extract bigbags data and remove it from the DTO
      const { bigbags, ...batchData } = updateBatchDto;
      
      // Get the existing batch
      const batch = await this.findOne(id);
      
      // Update batch data
      Object.assign(batch, batchData);
      const updatedBatch = await queryRunner.manager.save(batch);

      // Delete all existing bigbags for this batch
      await queryRunner.manager.delete(Bigbag, { batchId: id });

      // Create and save new bigbags if they exist
      if (bigbags && bigbags.length > 0) {
        const bigbagEntities = bigbags.map(bigbagData => ({
          ...bigbagData,
          batchId: id,
          createdByUserId: updatedBatch.createdByUserId,
        }));
        
        await queryRunner.manager.save(Bigbag, bigbagEntities);
      }

      await queryRunner.commitTransaction();
      return updatedBatch;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Batch number already exists');
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    await this.batchRepository.softDelete(id);
  }

  async findDeleted(): Promise<Batch[]> {
    return this.batchRepository.find({
      relations: ['createdByUser'],
      select: ['id', 'batchNumber', 'createdAt', 'createdByUserId', 'deleted_at']
    });
  }
}
