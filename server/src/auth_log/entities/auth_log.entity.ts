import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AuthLogStatusEnum } from '../type/auth-log.status.enum';

@Entity()
export class AuthLog {
  @PrimaryColumn('uuid')
  id: string = uuidv4();

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  user: User;

  @Column()
  ip_address: string;

  @Column()
  user_agent: string;

  @Column({
    type: 'enum',
    enum: AuthLogStatusEnum,
    default: AuthLogStatusEnum.SUCCESS,
  })
  status: AuthLogStatusEnum;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ default: 'Unknown' })
  location?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  loggedAt: Date;
}
