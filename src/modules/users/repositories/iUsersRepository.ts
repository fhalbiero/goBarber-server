import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/iCreateUserDTO';
import IFindAllProvidersDTO from '../dtos/IFindAllProvidersDTO';

export default interface IUsersRepository {
    create(data: ICreateUserDTO): Promise<User>;
    findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>;
    findByEmail(email: string): Promise<User | undefined>;
    findById(id: string): Promise<User | undefined>;
    save(user: User): Promise<User>;
}