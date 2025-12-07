import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class PriorityLevel {
  @PrimaryGeneratedColumn()
  id!: number; // 1, 2, 3

  @Column({ unique: true })
  name!: string; // 'Low', 'Medium', 'High'

  @Column()
  color!: string; // '#6c757d', etc.

  @Column()
  sortOrder!: number; // 1,2,3
}
