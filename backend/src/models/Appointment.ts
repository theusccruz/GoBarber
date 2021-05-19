import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/*
	O decorator @Entity funciona como uma função, a classe que está
	abaixo dele funciona como um parâmetro a ser passado.
	Tudo o que vier para essa classe será adicionado na tabela
	appointments no banco.
	A classe é exportada como uma entidade que tem relação direta com o banco
	de dados.
*/
@Entity('appointments')
class Appointment {
	// Mapeando as colunas do banco, com atributos da classe
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	provider: string;

	@Column('timestamp with time zone')
	date: Date;
}

export default Appointment;
