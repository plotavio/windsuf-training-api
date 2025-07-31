import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bigbag } from './bigbag.entity';
import { CreateBigbagDto } from './dto/create-bigbag.dto';
import { UpdateBigbagDto } from './dto/update-bigbag.dto';

@Injectable()
export class BigbagService {
  constructor(
    @InjectRepository(Bigbag)
    private readonly bigbagRepository: Repository<Bigbag>,
  ) {}

  async create(createBigbagDto: CreateBigbagDto): Promise<Bigbag> {
    const bigbag = this.bigbagRepository.create(createBigbagDto);
    return this.bigbagRepository.save(bigbag);
  }

  async findAll(): Promise<Bigbag[]> {
    return this.bigbagRepository.find();
  }

  async findOne(id: number): Promise<Bigbag> {
    const bigbag = await this.bigbagRepository.findOne({ where: { id } });
    if (!bigbag) {
      throw new NotFoundException(`Bigbag with ID "${id}" not found`);
    }
    return bigbag;
  }

  async update(id: number, updateBigbagDto: UpdateBigbagDto): Promise<Bigbag> {
    const bigbag = await this.findOne(id); // First, check if the resource exists
    await this.bigbagRepository.update(id, updateBigbagDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id); // First, check if the resource exists
    await this.bigbagRepository.update(id, { deleted_at: new Date() });
  }
}
