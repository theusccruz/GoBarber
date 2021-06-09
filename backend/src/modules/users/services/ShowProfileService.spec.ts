import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUserRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();

    showProfileService = new ShowProfileService(fakeUserRepository);
  });

  it('should be able show profile user', async () => {
    const user = await fakeUserRepository.create({
      name: 'Matheus',
      email: 'matheus@teste.com',
      password: '123456',
    });

    const profile = await showProfileService.execute(user.id);

    expect(profile).toHaveProperty('name');
    expect(profile.email).toBe('matheus@teste.com');
    expect(profile.name).toBe('Matheus');
  });

  it('should not be able to show profile when user does not exist', async () => {
    await expect(showProfileService.execute('incorrect-id')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
