import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';
import AppoinmentsRepository from '../repositories/AppoinmentsRepository';

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
	const parsedDate = startOfHour(parseISO(date));
	const findAppointmentInSameDate =
		appointmentsRepository.findByDate(parsedDate);

	if (findAppointmentInSameDate) {
		return response.status(400).json({
			message: `This appointment ins already booked / Este horário já está agendado`,
		});
	}

	const appointment = appointmentsRepository.create({
		provider,
		date: parsedDate,
	});
	return response.status(201).json(appointment);
});

export default appointmentsRouter;
