import { Column, Entity, BeforeInsert, Index } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ChronoEntity } from 'abtract/entity.abstract';
import { TfaState } from '../types/tfa-state.enum';
import { randomBytes } from 'crypto';
import { getEnvOrFatal } from 'common/utils/env.util';

@Entity()
export class User extends ChronoEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'boolean', default: false })
  is_email_verified: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: getEnvOrFatal('DEFAULT_PROFILE_PICTURE'),
  })
  profile_picture: string;

  @Column({ type: 'enum', enum: TfaState, default: TfaState.DISABLED })
  tfa_state: TfaState;

  @Column({ type: 'varchar', length: 255, select: false, nullable: true })
  tfa_secret: string;

  @Column({ type: 'varchar', length: 255, select: false, nullable: true })
  master_key: string;
  @BeforeInsert()
  async hashPassword() {
    if (!this.password) {
      this.password = randomBytes(12).toString('hex');
    }
    this.password = await bcrypt.hash(this.password, 10);
  }
}
