import AuthenticateUserService from './AuthenticateUserService';
import CreateUsersService from './CreateUserService';
import FakeUserRepository from '../repositories/fakes/fakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fake/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';


let fakeUsersRepository: FakeUserRepository
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;

let createUser: CreateUsersService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUserRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();

        createUser = new CreateUsersService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider);
        authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
    })

    it('should be able to authenticate', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '1234'  
        });

        const response = await authenticateUser.execute({
          email: 'johndoe@gmail.com',
          password: '1234'  
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });


    it('should not be able to authenticate with non existing user', async () => {
        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com',
            password: '1234'  
        });

        expect(authenticateUser.execute({
            email: 'johndoe@gmail.com',
            password: '123456'  
        })).rejects.toBeInstanceOf(AppError);
    });


})