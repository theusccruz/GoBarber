import { getCustomRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import UsersRepository from '../repositories/UsersRepository';
import User from '../models/User';
import authConfig from '../config/auth';

interface RequestDTO {
	email: string;
	password: string;
}

interface Response {
	user: User;
	token: string;
}

export default class AuthenticateUserService {
	public async execute({ email, password }: RequestDTO): Promise<Response> {
		const usersRepository = getCustomRepository(UsersRepository);

		const user = await usersRepository.findOne({
			where: { email },
		});
		if (!user) {
			throw new Error('Incorrect email/password combination');
		}

		const passwordMatched = await compare(password, user.password);
		if (!passwordMatched) {
			throw new Error('Incorrect email/password combination');
		}

		/*
			1 Payload, não fica seguro, informações mais simples
			2 Chave secreta, string crptografada
			3 Configurações do token: {
				1 subject: id do usuário que gerou o token
				2 expiresIn: Validade do token
			}

		*/
		const { secret, expiresIn } = authConfig.jwt;
		const token = sign({}, secret, {
			subject: user.id,
			expiresIn,
		});

		return {
			user,
			token,
		};
	}
}
