import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
  it('should be beable to create a new user', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

    const user = await createUser.execute({
      email: 'matheus@teste.com',
      name: 'Matheus Costa',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('matheus@teste.com');
  });

  it('shold not be able to create a new user with same email from another', async () => {
    const fakeUserRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUserRepository, fakeHashProvider);

    await createUser.execute({
      email: 'matheus@teste.com',
      name: 'Matheus Costa',
      password: '123456',
    });

    expect(
      createUser.execute({
        email: 'matheus@teste.com',
        name: 'Matheus Costa',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
