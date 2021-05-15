import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppoinmentsRepository from '../repositories/AppoinmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();
const appointmentsRepository = new AppoinmentsRepository();

/*
	Aqui será verificado se tem mais alguma coisa (ex: parâmetros) pós o
	"/appointments", se não tiver, /appointments vai se tornar o endereço raiz
	nesse contexto
*/
appointmentsRouter.get('/', (request, response) => {
	const appointments = appointmentsRepository.listAppointments();
	response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
	const { provider, date } = request.body;
	const parsedDate = parseISO(date);

	const createAppointment = new CreateAppointmentService(
		appointmentsRepository,
	);

	try {
		const appointment = createAppointment.execute({
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
