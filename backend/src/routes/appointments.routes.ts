import { getCustomRepository } from 'typeorm';
import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

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
	const { provider, date } = request.body;
	const parsedDate = parseISO(date);
	const createAppointment = new CreateAppointmentService();

	try {
		const appointment = await createAppointment.execute({
			provider,
			date: parsedDate,
		});

		return response.status(201).json(appointment);
	} catch (error) {
		return response.status(400).json({
			message: error.message,
		});
	}
});

export default appointmentsRouter;
