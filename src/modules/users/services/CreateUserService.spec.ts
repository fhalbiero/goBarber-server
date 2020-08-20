import CreateUsersService from './CreateUserService';
import FakeUserRepository from '../repositories/fakes/fakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fake/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUsersService;

describe('CreateUser', () => {

    beforeEach(() => {
      fakeUsersRepository = new FakeUserRepository();
      fakeHashProvider = new FakeHashProvider();
      createUser = new CreateUsersService(fakeUsersRepository, fakeHashProvider);
    })

    it('should be able to create a new user', async () => {
        const User = await createUser.execute({
          name: 'John Doe',
          email: 'johndoe@gmail.com',
          password: '1234'  
        });

        expect(User).toHaveProperty('id');
    });


    it('should not be able to create a new user with same e-mail from another', async () => {
        const email = 'johndoe@gmail.com';

        const user = await createUser.execute({
          name: 'John Doe',
          email,
          password: '1234'  
        });

        expect(createUser.execute({
            name: 'John Doe 2',
            email,
            password: '123456'  
          })).rejects.toBeInstanceOf(AppError);
    });


})