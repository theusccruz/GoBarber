import { startOfHour, isAfter, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  date: Date;
  user_id: string;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute({ provider_id, date, user_id }: IRequestDTO): Promise<Appointment> {
    const provider = await this.usersRepository.findById(provider_id);
    if (!provider) {
      throw new AppError('Provider not found', 404);
    }

    if (provider_id === user_id) {
      throw new AppError('It is not possible to make an appointment with yourself');
    }

    /*
			startOfHour está aqui pois faz parte de uma regra da aplicação,
			não podem existir agendamentos no mesmo horário
		*/
    const appointmentDate = startOfHour(date);
    if (isBefore(getHours(appointmentDate), 8) || isAfter(getHours(appointmentDate), 17)) {
      throw new AppError('This time cannot be scheduled');
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date");
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );
    if (findAppointmentInSameDate) {
      throw new AppError('This time is already scheduled');
    }

    const appointment = this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
      user_id,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para ${dateFormatted}`,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
