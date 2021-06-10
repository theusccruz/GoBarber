import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from '../../../../users/infra/typeorm/entities/User';

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
  provider_id: string;

  /*
		Relacionamentos SQL
		Um para Um (OneToOne)
		Um para Muitos (OneToMany)
		Muitos para Muitos (ManyToMany)
	*/
  @ManyToOne(() => User) // retorna qual model será utilizado
  @JoinColumn({ name: 'provider_id' }) // informa qual coluna do banco vai identificar esse relacionamento
  provider: User; // relacionamento sendo feito, agora essa propriedade tem acesso aos dados de User

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('timestamp with time zone')
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Appointment;
