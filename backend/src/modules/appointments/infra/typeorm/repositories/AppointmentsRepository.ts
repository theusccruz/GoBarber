import { getRepository, Repository } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import Appointment from '../entities/Appointment';
/*
	@EntityRepository vai pertencer à uma classe que crie um repostório
	personalizado. Repositórios personalizados contém os métodos que realizam
	ações no banco de dados: criar, ler, atualizar...

	Uma das formas de criar um reposítório personalizado, é criando uma nova
	classe que estenda a classe Repository. Repository é uma classe que contém
	os métodos de interação com o banco de dados.

	Para utilizar o repositório criado é necessário passar ele como parâmetro
	na função getCustomRepository().
*/

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  /*
		Aqui são estendidas as funções presentes na classe Repository (typeOrm),
		essas funções tem ação direta no banco de dados
	*/
  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      // findOne vai retornar uma Promise
      where: { date }, // { date: date }
    });

    return findAppointment; // se não encontrar um Appointment, retorna nulo
  }

  public async create({ date, provider_id }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      date,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
