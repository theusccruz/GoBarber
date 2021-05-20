import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import UsersRepository from '../repositories/UsersRepository';
import User from '../models/User';

interface RequestDTO {
	name: string;
	password: string;
	email: string;
}

export default class CreateUserService {
	public async execute({ name, password, email }: RequestDTO): Promise<User> {
		const usersRepository = getCustomRepository(UsersRepository);
		const findUserWithSameEmail = await usersRepository.findByEmail(email);

		if (findUserWithSameEmail) {
			throw new Error('Este email já possui cadastro');
		}

		const hashedPassoword = await hash(password, 8);
		const user = usersRepository.create({
			name,
			password: hashedPassoword,
			email,
		});

		await usersRepository.save(user);
		return user;
	}
}
