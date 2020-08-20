import "reflect-metadata";

import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import authConfig from '@config/auth';
import IUsersRepository from '../repositories/iUsersRepository';
import IHashProvider from '../providers/HashProvider/models/iHashProvider';

interface Request {
    email: string;
    password: string;
}

interface Response {
    user: User;
    token: string;
}

@injectable()
class AuthenticateUserService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider
    ) {}

    public async execute({ email, password }: Request): Promise<Response> {

        const user = await this.usersRepository.findByEmail( email );

        if (!user) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        const passwordMatched = await this.hashProvider.compareHash(password, user.password);

        if (!passwordMatched) {
            throw new AppError('Incorrect email/password combination', 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn: expiresIn //1 dia
        });

        return {
            user,
            token
        };
    }

}

export default AuthenticateUserService;