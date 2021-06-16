import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

// it - isto

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeUsersRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be beable to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 6, 10, 15).getTime();
    });

    const provider = await fakeUsersRepository.create({
      name: 'Matheus',
      email: 'matheus@teste.com',
      password: '123456',
    });

    const appointment = await createAppointment.execute({
      date: new Date(2021, 6, 10, 16),
      provider_id: provider.id,
      user_id: '32132132',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(provider.id);
  });

  it('should not be able to create two appointments on the same time', async () => {
    const provider = await fakeUsersRepository.create({
      name: 'Matheus',
      email: 'matheus@teste.com',
      password: '123456',
    });

    const appointmentDate = new Date(2021, 7, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: provider.id,
      user_id: '32132132',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: provider.id,
        user_id: '32132132',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointments on a past date', async () => {
    const provider = await fakeUsersRepository.create({
      name: 'Matheus',
      email: 'matheus@teste.com',
      password: '123456',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 6, 10, 15).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 6, 10, 10),
        provider_id: provider.id,
        user_id: '32132132',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create appointments if the provider does not exist', async () => {
    await expect(
      createAppointment.execute({
        date: new Date(2021, 6, 10, 10),
        provider_id: 'incorrect provider',
        user_id: '32132132',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 6, 10, 15).getTime();
    });

    const provider = await fakeUsersRepository.create({
      name: 'Matheus',
      email: 'matheus@teste.com',
      password: '123456',
    });

    await expect(
      createAppointment.execute({
        date: new Date(2021, 6, 10, 16),
        provider_id: provider.id,
        user_id: provider.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment if the time is before 8AM or after 5PM', async () => {
    const provider = await fakeUsersRepository.create({
      name: 'Matheus',
      email: 'matheus@teste.com',
      password: '123456',
    });

    await expect(
      createAppointment.execute({
        // 5h
        date: new Date(2021, 6, 10, 5),
        provider_id: provider.id,
        user_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        // 5h
        date: new Date(2021, 6, 10, 19),
        provider_id: provider.id,
        user_id: 'user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
