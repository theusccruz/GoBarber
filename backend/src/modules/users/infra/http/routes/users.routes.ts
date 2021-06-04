import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '@modules/users/services/CreateUserService';
import uploadConfig from '@config/upload';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UsersRepository from '../../typeorm/repositories/UsersRepository';

const usersRouter = Router();
const upload = multer(uploadConfig);

interface ReturnedUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  created_at: Date;
  updated_at: Date;
}

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const usersRepository = new UsersRepository();
  const createUser = new CreateUserService(usersRepository);

  const newUser = await createUser.execute({
    name,
    email,
    password,
  });
  const newUserReturned: ReturnedUser = newUser;
  delete newUserReturned.password;

  return response.status(201).json(newUserReturned);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const usersRepository = new UsersRepository();
    const updateUserAvatar = new UpdateUserAvatarService(usersRepository);

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    const returnedUser: ReturnedUser = user;
    delete returnedUser.password;

    return response.json(returnedUser);
  },
);

export default usersRouter;
