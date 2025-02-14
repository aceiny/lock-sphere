import {
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Entity,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export abstract class ChronoEntity extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
