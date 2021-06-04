import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

// it - isto

describe('CreateAppointment', () => {
  it('should be beable to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '1321321323213',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1321321323213');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '1321321323213',
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '1321321323213',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
