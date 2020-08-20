import CreateAppointementsService from './CreateAppointmentService';
import FakeAppointmentRepository from '../repositories/fakes/fakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import AppError from '@shared/errors/AppError';

//Teste unitário -> pure functions 
let fakeAppointmentsRepository: FakeAppointmentRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointementsService;

describe('CreateAppointment', () => {

    beforeEach(() => {
        fakeNotificationsRepository = new FakeNotificationsRepository();
        fakeAppointmentsRepository = new FakeAppointmentRepository();
        fakeCacheProvider = new FakeCacheProvider();
        createAppointment = new CreateAppointementsService(
            fakeAppointmentsRepository, 
            fakeNotificationsRepository,
            fakeCacheProvider
        );
    });
    

    it('should be able to create a new appointment', async () => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 7, 10, 12).getTime();
        });

        const appointment = await createAppointment.execute({
            date: new Date(2020, 7, 10, 13),
            user_id: 'user-id',
            provider_id: 'provider-id',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123123123');
    });


    it('should not be able to create two appointments on the same time', async () => {
        const appointmentDate = new Date(2020, 7, 10, 12);

        await createAppointment.execute({
            date: appointmentDate,
            user_id: 'user-id',
            provider_id: 'provider-id',
        });

        await expect(createAppointment.execute({
            date: appointmentDate,
            user_id: 'user-id',
            provider_id: 'provider-id',
        })).rejects.toBeInstanceOf(AppError)
    }); 


    it('should not be able to create appointments on past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 7, 15, 12).getTime();
        });

        await expect(createAppointment.execute({
            date: new Date(2020, 7, 15, 11),
            user_id: 'user-id',
            provider_id: 'provider-id',
        })).rejects.toBeInstanceOf(AppError)
    }); 


    it('should not be able to create an appointments with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 7, 15, 12).getTime();
        });

        await expect(createAppointment.execute({
            date: new Date(2020, 7, 15, 14),
            user_id: 'user-id',
            provider_id: 'user-id',
        })).rejects.toBeInstanceOf(AppError)
    }); 


    it('should not be able to create an appointments before 8am or before 5pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 7, 15,6).getTime();
        });

        await expect(createAppointment.execute({
            date: new Date(2020, 7, 15, 7),
            user_id: 'user-id',
            provider_id: 'provider-id',
        })).rejects.toBeInstanceOf(AppError);


        await expect(createAppointment.execute({
            date: new Date(2020, 7, 15, 18),
            user_id: 'user-id',
            provider_id: 'provider-id',
        })).rejects.toBeInstanceOf(AppError)
    });



})