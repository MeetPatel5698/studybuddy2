import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Subject } from './Subject';
import { Task } from './Task';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ default: 'student' })
  role!: 'admin' | 'student';

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Subject, (subject) => subject.user)
  subjects!: Subject[];

  @OneToMany(() => Task, (task) => task.user)
  tasks!: Task[];
}
