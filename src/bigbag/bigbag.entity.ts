import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Batch } from '../batch/batch.entity';

@Entity('bigbag')
export class Bigbag {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  createdByUserId: number;

  @Column()
  batchId: number;

  @Column()
  numberOfBatch: number;

  @Column({ type: 'tinyint', nullable: true })
  question1: boolean;

  @Column({ type: 'tinyint', nullable: true })
  question2: boolean;

  @Column({ type: 'tinyint', nullable: true })
  question3: boolean;

  @Column({ type: 'tinyint', nullable: true })
  question4: boolean;

  @Column({ type: 'tinyint', nullable: true })
  question5: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser: User;

  @ManyToOne(() => Batch)
  @JoinColumn({ name: 'batchId' })
  batch: Batch;
}
