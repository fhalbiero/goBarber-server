import Appointment from '../models/Appointment';
import { EntityRepository, Repository } from 'typeorm';


//responsavel pelas operações no BD, buscas, inputs, deletes
@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment>{
    
    public async findByDate(date: Date): Promise< Appointment | null > {
        const findAppointment = await this.findOne({
            where: { date: date }
        });

        return findAppointment || null;
    }

}

export default AppointmentsRepository;