import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, IsDateString } from 'class-validator';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ name: 'citizen_id', unique: true })
  @IsString()
  @IsNotEmpty()
  citizenId: string;

  @Column({ type: 'timestamp' })
  @IsDateString()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  birthdate: Date;

  @CreateDateColumn({ name: 'created_at' })
  @Transform(({ value }) => new Date(value))
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Transform(({ value }) => new Date(value))
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @Transform(({ value }) => value ? new Date(value) : null)
  deletedAt: Date;
}
