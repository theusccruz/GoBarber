import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;
let createUser: CreateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be beable to authenticate a user', async () => {
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

  it('should not be beable to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'matheus@teste.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate user with incorrect password', async () => {
    await createUser.execute({
      email: 'matheus@teste.com',
      name: 'Matheus Costa',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'matheus@teste.com',
        password: 'incorrect-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
