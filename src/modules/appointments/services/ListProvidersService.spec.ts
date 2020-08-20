
import FakeUserRepository from '@modules/users/repositories/fakes/fakeUserRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';
import ListProvidersService from './ListProviderService';

let fakeUsersRepository: FakeUserRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUserRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProviders = new ListProvidersService(
            fakeUsersRepository,
            fakeCacheProvider
        );
    })

    it('should be able to list the providers', async () => {
        const user1 = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        });

        const user2 = await fakeUsersRepository.create({
            name: 'Jonh Tre',
            email: 'johntre@example.com', 
            password: '123456'      
        });

        const loggedUser = await fakeUsersRepository.create({
            name: 'logged-user',
            email: 'logged-user@example.com', 
            password: '123456'      
        });

        const providers = await listProviders.execute({ user_id: loggedUser.id });

        expect(providers).toEqual([
            user1,
            user2
        ]);
        
    });

})