import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/upload';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

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
  const createUser = new CreateUserService();

  try {
    const newUser = await createUser.execute({
      name,
      email,
      password,
    });
    const newUserReturned: ReturnedUser = newUser;
    delete newUserReturned.password;

    return response.status(201).json(newUserReturned);
  } catch (error) {
    return response.status(400).json({
      message: error.message,
    });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService();

    try {
      const user = await updateUserAvatar.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename,
      });

      const returnedUser: ReturnedUser = user;
      delete returnedUser.password;

      return response.json(returnedUser);
    } catch (error) {
      return response.status(400).json({
        message: error.message,
      });
    }
  },
);

export default usersRouter;
