import { ChronoEntity } from 'abtract/entity.abstract';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

@Entity()
export class Vault extends ChronoEntity {
  @Column()
  identifier: string;

  @Column({
    type: 'text',
    nullable: false,
    comment: 'Client-side encrypted payload using AES-256',
  })
  encrypted_payload: string;

  @Index('website_name_index')
  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Name of the associated service/website',
  })
  website_name: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'URL of the associated service',
  })
  website_url: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  category: Category;
}
