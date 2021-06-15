import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2019, 4, 8, 7, 0, 0).getTime();
    });

    await fakeAppointmentsRepository.create({
      // 8h
      date: new Date(2019, 4, 9, 8, 0, 0), // (ano, mês, dia, hora, minuto, segundo)
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    await fakeAppointmentsRepository.create({
      // 9h
      date: new Date(2019, 4, 9, 9, 0, 0),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    await fakeAppointmentsRepository.create({
      // 10h
      date: new Date(2019, 4, 9, 10, 0, 0),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    await fakeAppointmentsRepository.create({
      // 11h
      date: new Date(2019, 4, 9, 11, 0, 0),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    await fakeAppointmentsRepository.create({
      // 12h
      date: new Date(2019, 4, 9, 12, 0, 0),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    await fakeAppointmentsRepository.create({
      // 13h
      date: new Date(2019, 4, 9, 13, 0, 0),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    await fakeAppointmentsRepository.create({
      // 14h
      date: new Date(2019, 4, 9, 14, 0, 0),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    await fakeAppointmentsRepository.create({
      // 15h
      date: new Date(2019, 4, 9, 15, 0, 0),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    await fakeAppointmentsRepository.create({
      // 16h
      date: new Date(2019, 4, 9, 16, 0, 0),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    await fakeAppointmentsRepository.create({
      // 17h
      date: new Date(2019, 4, 9, 17, 0, 0),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    await fakeAppointmentsRepository.create({
      date: new Date(2019, 5, 22, 20, 0, 0),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id: 'provider_id',
      year: 2019,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        {
          day: 9,
          available: false,
        },
        {
          day: 22,
          available: true,
        },
      ]),
    );
  });
});
