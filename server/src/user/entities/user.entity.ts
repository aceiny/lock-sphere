import { Column, Entity, BeforeInsert, Index } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ChronoEntity } from 'abtract/entity.abstract';

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
  is_mfa_enabled: boolean;

  @Column({ type: 'boolean', default: false })
  is_email_verfied: boolean;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
