import { isEqual } from 'date-fns';
import Appointment from '../models/Appointment';

interface CreateAppointmentDTO {
	provider: string;
	date: Date;
}

class AppoinmentsRepository {
	private appointments: Appointment[];

	constructor() {
		this.appointments = [];
	}

	public findByDate(date: Date): Appointment | null {
		const findAppointment = this.appointments.find(appointment =>
			isEqual(date, appointment.date),
		);

		return findAppointment || null; // se não encontrar um Appointment, retorna nulo
	}

	public listAppointments(): Appointment[] {
		return this.appointments;
	}

	public create({ provider, date }: CreateAppointmentDTO): Appointment {
		const appointment = new Appointment(provider, date);

		this.appointments.push(appointment);
		return appointment;
	}
}

export default AppoinmentsRepository;
