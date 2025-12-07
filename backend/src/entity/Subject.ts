import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Task } from './Task';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  color!: string;

  @Column({ nullable: true })
  description!: string;

  @ManyToOne(() => User, (user) => user.subjects, { onDelete: 'CASCADE' })
  user!: User;

  @OneToMany(() => Task, (task) => task.subject)
  tasks!: Task[];

  @CreateDateColumn()
  createdAt!: Date;
}
