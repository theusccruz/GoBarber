import { EntityRepository, Repository } from 'typeorm';
import Appointment from '../models/Appointment';
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
@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment> {
	/*
		Aqui são estendidas as funções presentes na classe Repository (typeOrm),
		essas funções tem ação direta no banco de dados
	*/
	public async findByDate(date: Date): Promise<Appointment | null> {
		const findAppointment = await this.findOne({
			// findOne vai retornar uma Promise
			where: { date }, // { date: date }
		});
		return findAppointment || null; // se não encontrar um Appointment, retorna nulo
	}
}

export default AppointmentsRepository;
