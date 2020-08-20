import "reflect-metadata";
import { injectable, inject } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import IUsersRepository from '../repositories/iUsersRepository';
import IUserTokensRepository from "../repositories/IUserTokensRepository";
import IHashProvider from '../providers/HashProvider/models/iHashProvider';
import AppError from "@shared/errors/AppError";

interface IRequest {
    token: string;
    password: string;
}

@injectable()
class ResetPasswordService {

    constructor(
        @inject('UsersRepository')
        private userRepository: IUsersRepository,

        @inject('UserTokenRepository')
        private userTokenRepository: IUserTokensRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider
    ) {}

    public async execute({ token, password}: IRequest): Promise<void> {
        const userToken = await this.userTokenRepository.findByToken(token);

        if (!userToken) {
            throw new AppError("User token does not exists");
        }

        const user = await this.userRepository.findById(userToken.user_id);

        if (!user) {
            throw new AppError("User does not exists");
        }

        const tokenCreatedAt = userToken.created_at;
        const compareDate = addHours(tokenCreatedAt, 2);

        if (isAfter(tokenCreatedAt, compareDate)) {
            throw new Error("Token expired");
        }

        user.password = await this.hashProvider.generateHash(password);

        await this.userRepository.save(user);
    }

}

export default ResetPasswordService;