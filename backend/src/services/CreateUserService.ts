import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import UsersRepository from '../repositories/UsersRepository';
import User from '../models/User';
import AppError from '../errors/AppError';

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
      throw new AppError('Este email já possui cadastro');
    }

    const hashedPassword = await hash(password, 8);
    const user = usersRepository.create({
      name,
      password: hashedPassword,
      email,
    });

    await usersRepository.save(user);
    return user;
  }
}
