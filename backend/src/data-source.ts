import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Subject } from './entity/Subject';
import { Task } from './entity/Task';
import { PriorityLevel } from './entity/PriorityLevel';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'studybuddy.sqlite',
  synchronize: true, // dev only
  logging: false,
  entities: [User, Subject, Task, PriorityLevel],
});
