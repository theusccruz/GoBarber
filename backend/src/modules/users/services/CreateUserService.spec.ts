import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be beable to create a new user', async () => {
    const user = await createUser.execute({
      email: 'matheus@teste.com',
      name: 'Matheus Costa',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('matheus@teste.com');
  });

  it('shold not be able to create a new user with same email from another', async () => {
    await createUser.execute({
      email: 'matheus@teste.com',
      name: 'Matheus Costa',
      password: '123456',
    });

    await expect(
      createUser.execute({
        email: 'matheus@teste.com',
        name: 'Matheus Costa',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
