import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, 
         UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
/**
 *  Um para Um (OneToOne)
 *  Um para Muitos (OneToMany)
 *  Muitos para Muitos (ManyToMany)
 */

//representação dos dados
@Entity('appointments')
class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    provider_id: string;
    //ponto de vista dessa entidade
    //Muitos appointements para um User
    @ManyToOne(() => User)
    @JoinColumn({ name: 'provider_id' })
    provider: User;

    @Column()
    user_id: string;
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('timestamp with time zone')
    date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn() 
    updated_at: Date;

}

export default Appointment;