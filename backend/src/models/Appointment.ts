import { v4 as uuidv4 } from 'uuid';

class Appointment {
	id: string;

	provider: string;

	date: Date;

	constructor({ provider, date }: Omit<Appointment, 'id'>) {
		/*
			Omit<Appointment, 'id'> indica que a função recebe todos os
			atributos da classe exceto o id, Omit<Tipo, variável a ser omitida>
		*/
		this.id = uuidv4();
		this.provider = provider;
		this.date = date;
	}
}

export default Appointment;
