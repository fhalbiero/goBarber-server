import "reflect-metadata";
import { injectable, inject } from 'tsyringe'

import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/iUsersRepository';
import IHashProvider from '../providers/HashProvider/models/iHashProvider';
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";

interface Request {
    name: string;
    email: string;
    password: string;
}

@injectable()
class CreateUserService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
        @inject('CacheProvider')
        private cacheProvider: ICacheProvider
    ) {}

    public async execute({name, email, password}: Request): Promise<User> {

        const checkUserExists = await this.usersRepository.findByEmail(email);

        if (checkUserExists) {
            throw new AppError('Email address already used.');
        }

        const hashedPassword = await this.hashProvider.generateHash(password);

        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword
        });

        await this.cacheProvider.invalidatePrefix(`provider-list`);

        return user;
    }

}

export default CreateUserService;