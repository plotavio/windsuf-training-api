import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './types/user-response.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.find({
      select: ['id', 'name', 'email', 'citizenId', 'birthdate', 'createdAt', 'updatedAt'],
      withDeleted: false
    });
    return users;
  }

  async findOne(id: number): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email', 'citizenId', 'birthdate', 'createdAt', 'updatedAt'],
      withDeleted: false
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'citizenId', 'birthdate', 'createdAt', 'updatedAt'],
      withDeleted: false
    });
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
      
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      
      const savedUser = await this.userRepository.save(user);
      const { password, ...userResponse } = savedUser;
      return userResponse;
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.sqlMessage.includes('UQ_97672ac88f789774dd47f7c8be3')) {
          throw new ConflictException('Email already exists');
        }
        if (error.sqlMessage.includes('UQ_f8c94b602bb7ac6a86a2266a52b')) {
          throw new ConflictException('Citizen ID already exists');
        }
        throw new ConflictException('Duplicate entry detected');
      }
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    try {
      const user = await this.findOne(id);
      await this.userRepository.update(id, updateUserDto);
      return this.findOne(id);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.sqlMessage.includes('UQ_97672ac88f789774dd47f7c8be3')) {
          throw new ConflictException('Email already exists');
        }
        if (error.sqlMessage.includes('UQ_f8c94b602bb7ac6a86a2266a52b')) {
          throw new ConflictException('Citizen ID already exists');
        }
        throw new ConflictException('Duplicate entry detected');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.softDelete(id);
  }

  async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken });
  }

  async getRefreshToken(userId: number): Promise<string | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['refreshToken'],
    });
    return user?.refreshToken || null;
  }

  async restore(id: number): Promise<UserResponse> {
    try {
      const result = await this.userRepository.restore(id);
      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found or already restored`);
      }
      return this.findOne(id);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.sqlMessage.includes('UQ_97672ac88f789774dd47f7c8be3')) {
          throw new ConflictException('Email already exists');
        }
        if (error.sqlMessage.includes('UQ_f8c94b602bb7ac6a86a2266a52b')) {
          throw new ConflictException('Citizen ID already exists');
        }
        throw new ConflictException('Duplicate entry detected');
      }
      throw error;
    }
  }

  async findDeleted(): Promise<UserResponse[]> {
    const users = await this.userRepository.find({
      select: ['id', 'name', 'email', 'citizenId', 'birthdate', 'createdAt', 'updatedAt', 'deletedAt'],
      withDeleted: true,
      where: {
        deletedAt: Not(IsNull())
      }
    });
    return users;
  }
}
