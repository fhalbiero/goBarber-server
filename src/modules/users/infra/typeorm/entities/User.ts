import { Entity, Column, PrimaryGeneratedColumn, 
         CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import uploadConfig from '@config/upload';

//representação dos dados
@Entity('users')
class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    avatar: string;

    @Expose({ name: 'avatar_url' }) 
    getAvatarUrl(): string | null {
        if (!this.avatar) return null;

        switch (uploadConfig.driver) {
            case 'disk':
                return `${process.env.APP_API_URL}/files${this.avatar}`;
            case 's3':
                return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.avatar}`;
            default :
                return null;
        }
    }

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn() 
    updated_at: Date;

}

export default User;