import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UsersController from '../../controllers/UsersController';
import UserAvatarController from '../../controllers/UserAvatarController';

const usersRouter = Router();
const upload = multer(uploadConfig);
const usersController = new UsersController();
const usersAvatarController = new UserAvatarController();

usersRouter.post('/', async (request, response) => {
  usersController.create(request, response);
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    usersAvatarController.update(request, response);
  },
);

export default usersRouter;
