import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

// it - isto

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeUsersRepository: FakeUsersRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeUsersRepository,
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
});
