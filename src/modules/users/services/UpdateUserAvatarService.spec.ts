
import FakeUserRepository from '../repositories/fakes/fakeUserRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProviders/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;

let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUserRepository();
        fakeStorageProvider = new FakeStorageProvider();

        updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository, 
            fakeStorageProvider
        );
    })

    it('should be able to update a user avatar', async () => {
        const user = await fakeUsersRepository.create({
          name: 'John Doe',
          email: 'johndoe@gmail.com',
          password: '1234'  
        });

        await updateUserAvatar.execute({
           user_id: user.id,
           avatarFilename: 'avatar.jpg'            
        })

        expect(user.avatar).toBe('avatar.jpg');
    });


    it('should not be able to update avatar from non existing user', async () => {
        expect(updateUserAvatar.execute({
           user_id: 'non-existing-user',
           avatarFilename: 'avatar.jpg'            
        })).rejects.toBeInstanceOf(AppError);

    });


    it('should delete old avatar when updating new one',  async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUsersRepository.create({
          name: 'John Doe',
          email: 'johndoe@gmail.com',
          password: '1234'  
        });

        await updateUserAvatar.execute({
           user_id: user.id,
           avatarFilename: 'avatar.jpg'            
        });


        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg'            
         });

         expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

        expect(user.avatar).toBe('avatar2.jpg');
    });

})