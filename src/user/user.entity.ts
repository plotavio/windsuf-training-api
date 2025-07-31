import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, IsDateString } from 'class-validator';
import { Batch } from '../batch/batch.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Batch, (batch) => batch.createdByUser)
  batches: Batch[];

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

  @Column({ nullable: true, name: 'refresh_token' })
  @Exclude({ toPlainOnly: true })
  refreshToken: string;

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
