import ResetPasswordService from './ResetPasswordService';
import FakeUserRepository from '../repositories/fakes/fakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fake/FakeHashProvider';
import FakeUserTokensRepository from '../repositories/fakes/fakeUserTokensRepository';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {

    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPassword = new ResetPasswordService(
            fakeUserRepository, 
            fakeUserTokensRepository,
            fakeHashProvider
        );
    });


    it('should be able to reset the password', async () => {
        const user = await fakeUserRepository.create({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: '123456'  
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPassword.execute({
            token,
            password: '654321'
        });

        const updatedUser = await fakeUserRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('654321');
        expect(updatedUser?.password).toBe('654321');
    });


    it('should not be able to reset the password with no existring token', async () => {
        await expect(resetPassword.execute({
            token: 'non-existing-token',
            password: '654321'
        })).rejects.toBeInstanceOf(AppError);
    });


    it('should not be able to reset the password with no existring user', async () => {
        const { token } = await fakeUserTokensRepository.generate('non-existing-user');
        
        await expect(
            resetPassword.execute({
                token,
                password: '654321'
            })
        ).rejects.toBeInstanceOf(AppError);
    });


    it('should not be able to reset the password if passed more than 2 hours', async () => {
        const user = await fakeUserRepository.create({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: '123456'  
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();
            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPassword.execute({
                token,
                password: '654321'
            })
        ).rejects.toBeInstanceOf(AppError);

    });

});