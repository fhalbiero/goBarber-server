import { Entity, Column, PrimaryGeneratedColumn, 
         CreateDateColumn, UpdateDateColumn, Generated } from 'typeorm';


//representação dos dados
@Entity('user_tokens')
class UserTokens {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Generated('uuid')
    token: string;

    @Column()
    user_id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn() 
    updated_at: Date;

}

export default UserTokens;