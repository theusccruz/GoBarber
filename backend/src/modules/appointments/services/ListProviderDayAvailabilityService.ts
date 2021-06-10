import { inject, injectable } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

type IAvailability = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
    day,
  }: IRequestDTO): Promise<IAvailability> {
    const currentDate = new Date(Date.now());
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
      day,
      month,
      provider_id,
      year,
    });

    const hourStart = 8;
    const eachHourArray = Array.from({ length: 10 }, (value, index) => index + hourStart);

    const availability = eachHourArray.map(hour => {
      const hasAppointmentsInHour = appointments.find(appointment => {
        return getHours(appointment.date) === hour;
      });

      const selectedDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasAppointmentsInHour && isAfter(selectedDate, currentDate),
      };
    });

    return availability;
  }
}
