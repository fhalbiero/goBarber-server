
import AppError from '@shared/errors/AppError';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/fakeAppointmentsRepository';


let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailability: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {

    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderDayAvailability = new ListProviderDayAvailabilityService(fakeAppointmentsRepository);
    })

    it('should be able to list the day availability from provider', async () => {
        
        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: '123',
            date: new Date(2020, 7, 10, 14, 0, 0)
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'user',
            user_id: '123',
            date: new Date(2020, 7, 10, 13, 0, 0)
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 7, 10, 11, 0, 0).getTime();  
        })

        const availability = listProviderDayAvailability.execute({
            provider_id: 'user',
            year: 2020,
            month: 8,
            day: 10
        });


        expect(availability).toEqual(expect.arrayContaining([
            { hour: 8, available: false },
            { hour: 9, available: false },
            { hour: 10, available: false },
            { hour: 11, available: false },
            { hour: 12, available: true },
            { hour: 13, available: false },
            { hour: 14, available: false },
            { hour: 15, available: true },
        ]));
        
    });

})