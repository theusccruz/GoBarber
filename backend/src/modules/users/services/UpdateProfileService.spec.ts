import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Matheus',
      email: 'matheus@teste.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Matias',
      email: 'matheus@teste2.com',
    });

    expect(updatedUser.name).toBe('Matias');
    expect(updatedUser.email).toBe('matheus@teste2.com');
  });

  it('should not be able to change email already used by another user', async () => {
    await fakeUsersRepository.create({
      name: 'Matheus',
      email: 'matheus@teste.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Matias',
      email: 'matias@teste.com',
      password: '123456789',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Matias',
        email: 'matheus@teste.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Matheus',
      email: 'matheus@teste.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Matias',
      email: 'matheus@teste2.com',
      password: '123123',
      old_password: '123456',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update password without entering previous password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Matheus',
      email: 'matheus@teste.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Matias',
        email: 'matheus@teste2.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Matheus',
      email: 'matheus@teste.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Matias',
        email: 'matheus@teste2.com',
        password: '123123',
        old_password: '65421356987',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update profile when user does not exist', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'incorrect-id',
        name: 'Matias',
        email: 'matheus@teste2.com',
        password: '123123',
        old_password: '65421356987',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
