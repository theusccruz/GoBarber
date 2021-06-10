import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list availability for one day of the month', async () => {
    await fakeAppointmentsRepository.create({
      // 14h
      date: new Date(2019, 4, 6, 14, 0, 0), // (ano, mês, dia, hora, minuto, segundo)
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    await fakeAppointmentsRepository.create({
      // 15h
      date: new Date(2019, 4, 6, 15, 0, 0),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2019, 4, 6, 11).getTime();
    });

    const availability = await listProviderDayAvailabilityService.execute({
      provider_id: 'provider_id',
      year: 2019,
      month: 5,
      day: 6,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        {
          hour: 8,
          available: false,
        },
        {
          hour: 9,
          available: false,
        },
        {
          hour: 14,
          available: false,
        },
        {
          hour: 15,
          available: false,
        },
        {
          hour: 16,
          available: true,
        },
        {
          hour: 17,
          available: true,
        },
      ]),
    );
  });
});
