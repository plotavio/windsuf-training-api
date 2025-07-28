import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('batch')
export class Batch {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  batchNumber: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  createdByUserId: number;

  @ManyToOne(() => User, (user) => user.batches)
  createdByUser: User;

  @DeleteDateColumn()
  deletedAt: Date;
}
