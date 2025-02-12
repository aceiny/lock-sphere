import { ChronoEntity } from "abtract/entity.abstract";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinTable, ManyToOne } from "typeorm";

@Entity()
export class Category extends ChronoEntity{
    @Column()
    name: string;

    @ManyToOne(()=>User, {onDelete : 'CASCADE'})
    user: User;
}
