import { Column, Entity, BeforeInsert, Index, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ChronoEntity } from 'abtract/entity.abstract';
import { Exclude } from 'class-transformer';
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

  @Column({ type: 'enum', enum: TfaState, default: TfaState.DISABLED })
  tfa_state: TfaState;

  @Column({ type: 'boolean', default: false })
  is_email_verified: boolean;
  
  @Column({ type: 'varchar', length: 255, nullable: true , default : getEnvOrFatal('DEFAULT_PROFILE_PICTURE')})
  
  profile_picture : string;
  @BeforeInsert()
  async hashPassword() {
    if(!this.password){
      this.password = randomBytes(12).toString('hex');
    }
    this.password = await bcrypt.hash(this.password, 10);
  }
}
