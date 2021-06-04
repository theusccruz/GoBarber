import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface RequestDTO {
  name: string;
  password: string;
  email: string;
}
@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ name, password, email }: RequestDTO): Promise<User> {
    const findUserWithSameEmail = await this.usersRepository.findByEmail(email);

    if (findUserWithSameEmail) {
      throw new AppError('Este email já possui cadastro');
    }

    const hashedPassword = await hash(password, 8);
    const user = this.usersRepository.create({
      name,
      password: hashedPassword,
      email,
    });

    return user;
  }
}