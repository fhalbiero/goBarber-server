import SendForgotPasswordEmail from './SendForgotPasswordEmailService';
import FakeUserRepository from '../repositories/fakes/fakeUserRepository';
import FakeUserTokensRepository from '../repositories/fakes/fakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';

let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeUserRepository: FakeUserRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmail;

describe('SendForgotPasswordEmail', () => {

    beforeEach(() => {
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeUserRepository = new FakeUserRepository();
        fakeMailProvider = new FakeMailProvider();

        sendForgotPasswordEmail = new SendForgotPasswordEmail(
            fakeUserRepository, 
            fakeMailProvider,
            fakeUserTokensRepository
        );
    });

    it('should be able to recover the password using the email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUserRepository.create({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: '123456'  
        });

        await sendForgotPasswordEmail.execute({
          email: 'johndoe@gmail.com', 
        });

        expect(sendMail).toHaveBeenCalled();
    });


    it('should generate a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUserRepository.create({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: '123456'  
        });

        await sendForgotPasswordEmail.execute({
          email: 'johndoe@gmail.com', 
        });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });

    it('should not be able to recover a non-existing user password', async () => {

      await expect(sendForgotPasswordEmail.execute({
        email: 'johndoe@gmail.com', 
      })).rejects.toBeInstanceOf(AppError);
      
    });

})