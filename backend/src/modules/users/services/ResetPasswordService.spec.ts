import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ResetPasswordService from './ResetPasswordService';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let fakeUserRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    resetPasswordService = new ResetPasswordService(
      fakeUserRepository,
      fakeHashProvider,
      fakeUserTokensRepository,
    );
  }); // cria variáveis antes da execução de cada um dos testes

  it('should be able to reset the password', async () => {
    // const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const user = await fakeUserRepository.create({
      name: 'Matheus',
      email: 'matheus@teste.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    await resetPasswordService.execute({
      password: '123987',
      token,
    });

    const updatedUser = await fakeUserRepository.findById(user.id);

    // expect(generateHash).toHaveBeenCalledWith('123456');
    expect(updatedUser?.password).toBe('123987');
  });

  it('should not be ablke to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        password: '123987',
        token: 'token inexistente',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
