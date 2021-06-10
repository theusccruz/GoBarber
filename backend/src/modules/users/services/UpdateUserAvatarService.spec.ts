import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);
  });

  it('should be beable to update avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Matheus',
      email: 'matheus@teste.com',
      password: '123456789',
    });

    await updateUserAvatar.execute({
      avatarFilename: 'avatarFile.jpg',
      user_id: user.id,
    });

    expect(user.avatar).toBe('avatarFile.jpg');
  });

  it('should not be beable to update avatar from non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        avatarFilename: 'avatarFile.jpg',
        user_id: '132132654',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    // o jest vai espionar a função deleteFile e ver se ela será disparada

    const user = await fakeUsersRepository.create({
      name: 'Matheus',
      email: 'matheus@teste.com',
      password: '123456789',
    });

    await updateUserAvatar.execute({
      avatarFilename: 'avatarFile.jpg',
      user_id: user.id,
    });

    await updateUserAvatar.execute({
      avatarFilename: 'avatarFile2.jpg',
      user_id: user.id,
    });

    expect(deleteFile).toHaveBeenCalledWith('avatarFile.jpg');
    // verifica se deleteFile foi chamada com um parâmetro definido, no caso com o avatar antigo

    expect(user.avatar).toBe('avatarFile2.jpg');
  });
});
