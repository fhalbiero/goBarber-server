import "reflect-metadata";
import { injectable, inject } from 'tsyringe';
import { startOfHour, isBefore, getHours, format } from 'date-fns';

import Appointment from '../infra/typeorm/entities/Appointment';

import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";

// SOLID
// [X] Sinfle Responsability principle
// [ ] Open Closed principle
// [X] Liskov Substitution principle
// [ ] Interface segregation principle
// [X] Dependency invertion principle

interface IRequest {
    provider_id: string;
    user_id: string;
    date: Date,
}

@injectable()
class CreateAppointmentService {

    constructor(
        @inject('AppintmentRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider
    ) {}

    public async execute({ date, provider_id, user_id }: IRequest): Promise<Appointment> {

        if (provider_id === user_id) {
            throw new AppError(`Yout can't create an appointment with yourself.`);
        }
        
        const appointmentDate = startOfHour(date);

        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError(`Yout can't create an appointment on a past date.`);
        }

        if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
            throw new AppError(`You can only create appointments between 8am and 5pm`);
        }

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
            provider_id,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked');
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id, 
            user_id,
            date: appointmentDate
        });

        const dateFormatted = format(date, "dd/MM/yyyy 'às' HH:mm'h' ");

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para dia ${dateFormatted}`,
        });

        await this.cacheProvider.invalidate(
            `provider-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`
        );

        return appointment;
    }

}

export default CreateAppointmentService;