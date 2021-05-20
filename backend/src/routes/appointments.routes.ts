import { getCustomRepository } from 'typeorm';
import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const appointmentsRouter = Router();
appointmentsRouter.use(ensureAuthenticated);

/*
	Aqui será verificado se tem mais alguma coisa (ex: parâmetros) pós o
	"/appointments", se não tiver, /appointments vai se tornar o endereço raiz
	nesse contexto
*/
appointmentsRouter.get('/', async (request, response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();
  response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;
  const parsedDate = parseISO(date);
  const createAppointment = new CreateAppointmentService();

  try {
    const newAppointment = await createAppointment.execute({
      provider_id,
      date: parsedDate,
    });

    return response.status(201).json(newAppointment);
  } catch (error) {
    return response.status(400).json({
      message: error.message,
    });
  }
});

export default appointmentsRouter;
