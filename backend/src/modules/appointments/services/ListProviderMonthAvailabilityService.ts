import { inject, injectable } from 'tsyringe';
import { getDate, getDaysInMonth, isAfter } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequestDTO {
  provider_id: string;
  month: number;
  year: number;
}

type IAvailability = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ provider_id, month, year }: IRequestDTO): Promise<IAvailability> {
    const currentDate = new Date(Date.now());
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
      provider_id,
      year,
      month,
    });

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));
    const eachDayArray = Array.from(
      {
        length: numberOfDaysInMonth,
      },
      (_, index) => index + 1,
    );

    const availability = eachDayArray.map(day => {
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      const selectedDate = new Date(year, month - 1, day, 17, 0, 0);

      return {
        day,
        available: appointmentsInDay.length < 10 && isAfter(selectedDate, currentDate),
      };
    });

    return availability;
  }
}
