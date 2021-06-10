import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'Vera',
      email: 'matheus@teste.com',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Luciana',
      email: 'matheus@teste1.com',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Luciana',
      email: 'matheus@teste3.com',
      password: '123456',
    });

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
    // toEqual verifica se as duas variáveis existem e tem o mesmo formato
  });
});
