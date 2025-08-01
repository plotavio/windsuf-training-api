import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Bigbag } from '../bigbag/bigbag.entity';

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
  deleted_at: Date;

  @OneToMany(() => Bigbag, (bigbag) => bigbag.batch)
  bigbags: Bigbag[];
}
