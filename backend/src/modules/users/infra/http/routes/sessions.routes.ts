import { Router } from 'express';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import UsersRepository from '../../typeorm/repositories/UsersRepository';

interface UserAuthenticated {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  created_at: Date;
  updated_at: Date;
}

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const usersRepository = new UsersRepository();
  const authenticateUser = new AuthenticateUserService(usersRepository);

  const { user, token } = await authenticateUser.execute({
    email,
    password,
  });

  const userAuthenticated: UserAuthenticated = user;
  delete userAuthenticated.password;

  return response.status(201).json({ user: userAuthenticated, token });
});

export default sessionsRouter;
