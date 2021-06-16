import { getRepository, Repository, Raw } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProvider from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
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
  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      // findOne vai retornar uma Promise
      where: {
        date,
        provider_id,
      }, // { date: date }
    });

    return findAppointment; // se não encontrar um Appointment, retorna nulo
  }

  public async create({
    date,
    provider_id,
    user_id,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      date,
      user_id,
    });

    await this.ormRepository.save(appointment);

    return appointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    year,
    month,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    // caso o mês tenha menos de dois dígitos, adiciona um zero a esquerda do número
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      /*
        - Raw() permite executar queries manuais no DB
         -to_char() função do postgres que transforma dados em string
        - typeorm muda os nomes dos campos por segurança, por isso é necessário passar uma
        callback dentro do Raw(), ex: Raw(dateFieldName =>...
      */
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProvider): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      relations: ['user'],
    });

    return appointments;
  }
}

export default AppointmentsRepository;
