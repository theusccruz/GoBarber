import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  constructor(private appointmentsRepository: IAppointmentsRepository) {}

  public async execute({ provider_id, date }: IRequestDTO): Promise<Appointment> {
    /*
			startOfHour está aqui pois faz parte de uma regra da aplicação,
			não podem existir agendamentos no mesmo horário
		*/
    const appointmentDate = startOfHour(date);
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('Este horário já está agendado!');
    }

    const appointment = this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
