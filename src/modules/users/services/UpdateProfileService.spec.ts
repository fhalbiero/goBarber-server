
import FakeUserRepository from '../repositories/fakes/fakeUserRepository';
import FakeHashProvider from '../providers/HashProvider/fake/FakeHashProvider';
import AppError from '@shared/errors/AppError';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;

let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUserRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfileService = new UpdateProfileService(
            fakeUsersRepository, 
            fakeHashProvider
        );
    })

    it('should be able to update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'Jonh Tre',
            email: 'johntre@example.com',       
        });

        expect(updatedUser.name).toBe('John Tre');
        
    });


    it('should not be able to change the email to another user email', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const userToUpdate = await fakeUsersRepository.create({
            name: 'John Tre',
            email: 'johntre@example.com',
            password: '123456'
        });

        await expect(updateProfileService.execute({
            user_id: userToUpdate.id,
            name: 'Jonh Tre',
            email: 'johndoe@example.com',       
        })).rejects.toBeInstanceOf(AppError);
        
    });


    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@example.com',
            old_password: '123456',
            password: '654321'       
        });

        expect(updatedUser.password).toBe('654321');
        
    });


    it('should not be able to update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        await expect(updateProfileService.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '654321'       
        })).rejects.toBeInstanceOf(AppError);
        
    });


    it('should not be able to update the password with wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        await expect(updateProfileService.execute({
            user_id: user.id,
            name: 'John Doe',
            email: 'johndoe@example.com',
            old_password: 'wrong-old-password',
            password: '654321'       
        })).rejects.toBeInstanceOf(AppError);
        
    });


    it('should not be able to update the profile from non-existing user', async () => {
        await expect(updateProfileService.execute({
            user_id: 'non-existing-user-id',
            name: 'Test',
            email: 'test@exampl.com'
        })).rejects.toBeInstanceOf(AppError);
    });

})