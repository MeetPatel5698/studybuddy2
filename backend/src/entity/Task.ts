import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Subject } from './Subject';
import { PriorityLevel } from './PriorityLevel';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @ManyToOne(() => PriorityLevel, { eager: true })
  priority!: PriorityLevel;

  @Column({ type: 'datetime' })
  dueDate!: Date;

  @Column({ default: 'pending' })
  status!: 'pending' | 'done';

  @ManyToOne(() => Subject, (subject) => subject.tasks, { onDelete: 'CASCADE' })
  subject!: Subject;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
