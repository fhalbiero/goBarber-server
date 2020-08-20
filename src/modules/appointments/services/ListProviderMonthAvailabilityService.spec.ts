
import AppError from '@shared/errors/AppError';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/fakeAppointmentsRepository';


let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {

    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderMonthAvailability = new ListProviderMonthAvailabilityService(fakeAppointmentsRepository);
    })

    it('should be able to list the month availability from provider', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: '123',
            date: new Date(2020, 7, 12, 8, 0, 0)
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: '123',
            date: new Date(2020, 7, 12, 9, 0, 0)
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: '123',
            date: new Date(2020, 7, 12, 10, 0, 0)
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: '123',
            date: new Date(2020, 7, 12, 11, 0, 0)
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: '123',
            date: new Date(2020, 7, 12, 12, 0, 0)
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: '123',
            date: new Date(2020, 7, 12, 13, 0, 0)
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: '123',
            date: new Date(2020, 7, 12, 14, 0, 0)
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: '123',
            date: new Date(2020, 7, 12, 15, 0, 0)
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: '123',
            date: new Date(2020, 7, 12, 16, 0, 0)
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: '123',
            date: new Date(2020, 7, 12, 17, 0, 0)
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: '123',
            date: new Date(2020, 7, 13, 17, 0, 0)
        });

        const availability = listProviderMonthAvailability.execute({
            provider_id: 'user',
            year: 2020,
            month: 8,
        });

        expect(availability).toEqual(expect.arrayContaining([
            { day: 12, available: false },
            { day: 13, available: true },
        ]));
        
    });

})