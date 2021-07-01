import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';

interface IRequestDTO {
  user_id: string;
  email: string;
  name: string;
  password?: string;
  old_password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('Este email já é usado por outro usuário.');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError('Digite corretamente a atual e a nova senha');
    }

    if (password && old_password) {
      if (password === old_password) {
        throw new AppError('A nova senha não pode ser igual a anterior');
      }

      const checkold_password = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkold_password) {
        throw new AppError('Senha atual informada está incorreta');
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    await this.usersRepository.save(user);

    await this.cacheProvider.invalidatePrefix(`providers-list`);
    await this.cacheProvider.invalidatePrefix(`provider-appointments`);

    return user;
  }
}
