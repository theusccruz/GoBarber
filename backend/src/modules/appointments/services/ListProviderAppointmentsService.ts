import { injectable, inject } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';
import { isThisSecond } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

@injectable()
export default class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
    day,
  }: IRequestDTO): Promise<Appointment[]> {
    let appointments = await this.cacheProvider.recover<Appointment[]>(
      `provider-appointments:${provider_id}:${year}-${month}-${day}`,
    );

    if (!appointments) {
      appointments = await this.appointmentsRepository.findAllInDayFromProvider({
        day,
        month,
        provider_id,
        year,
      });

      await this.cacheProvider.save(
        `provider-appointments:${provider_id}:${year}-${month}-${day}`,
        appointments,
      );

      console.log('buscou do banco');
    }

    return appointments;
  }
}
