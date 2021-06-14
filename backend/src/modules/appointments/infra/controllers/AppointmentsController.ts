import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;

    const createAppointment = container.resolve(CreateAppointmentService);

    const newAppointment = await createAppointment.execute({
      provider_id,
      date,
      user_id: request.user.id,
    });

    return response.status(201).json(newAppointment);
  }
}
