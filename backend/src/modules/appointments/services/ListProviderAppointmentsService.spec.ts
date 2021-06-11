import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the appointments on a specific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      date: new Date(2021, 5, 21, 14, 0, 0),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      date: new Date(2021, 5, 21, 15, 0, 0),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    const appointment3 = await fakeAppointmentsRepository.create({
      date: new Date(2021, 5, 21, 16, 0, 0),
      provider_id: 'provider_id',
      user_id: 'user_id',
    });

    const appointments = await listProviderAppointments.execute({
      day: 21,
      month: 6,
      year: 2021,
      provider_id: 'provider_id',
    });

    expect(appointments).toEqual([appointment1, appointment2, appointment3]);
  });
});
