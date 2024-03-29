import { startOfHour, isAfter, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';
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

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ provider_id, date, user_id }: IRequestDTO): Promise<Appointment> {
    const provider = await this.usersRepository.findById(provider_id);
    if (!provider) {
      throw new AppError('Nenhum barbeiro cadastrado com este nome', 404);
    }

    if (provider_id === user_id) {
      throw new AppError('Não é possível fazer um agendamento com você mesmo');
    }

    /*
			startOfHour está aqui pois faz parte de uma regra da aplicação,
			não podem existir agendamentos no mesmo horário
		*/
    const appointmentDate = startOfHour(date);
    if (isBefore(getHours(appointmentDate), 8) || isAfter(getHours(appointmentDate), 17)) {
      throw new AppError('Este horário já está agendado');
    }

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('Não é possível criar agendamento em datas passadas');
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );
    if (findAppointmentInSameDate) {
      throw new AppError('Esse horário já está agendado');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
      user_id,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para ${dateFormatted}`,
    });

    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`,
      // 2021-6-16
    );

    return appointment;
  }
}

export default CreateAppointmentService;
