import { startOfHour } from 'date-fns';
import AppointmentRepository from '../repositories/AppoinmentsRepository';
import Appointment from '../models/Appointment';

interface RequestDTO {
	provider: string;
	date: Date;
}

class CreateAppointmentService {
	private appointmentsRepository: AppointmentRepository;

	constructor(appointmentsRepository: AppointmentRepository) {
		this.appointmentsRepository = appointmentsRepository;
	}

	public execute({ provider, date }: RequestDTO): Appointment {
		/*
			startOfHour está aqui pois faz parte de uma regra da aplicação,
			não podem existir agendamentos no mesmo horário
		*/
		const appointmentDate = startOfHour(date);
		const findAppointmentInSameDate =
			this.appointmentsRepository.findByDate(appointmentDate);

		if (findAppointmentInSameDate) {
			throw new Error('Este horário já está agendado!');
		}

		const appointment = this.appointmentsRepository.create({
			provider,
			date: appointmentDate,
		});

		return appointment;
	}
}

export default CreateAppointmentService;
