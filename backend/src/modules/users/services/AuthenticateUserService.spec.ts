import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
  it('should be beable to authenticate a user', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

    const user = await createUser.execute({
      email: 'matheus@teste.com',
      name: 'Matheus Costa',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'matheus@teste.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should be beable to authenticate a user', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

    await createUser.execute({
      email: 'matheus@teste.com',
      name: 'Matheus Costa',
      password: '123456',
    });

    expect(
      authenticateUser.execute({
        email: 'matheus@te5ste.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
