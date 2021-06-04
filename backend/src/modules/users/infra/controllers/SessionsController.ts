import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UserAuthenticated from '../../interfaces/IReturnedUser';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    const userAuthenticated: UserAuthenticated = user;
    delete userAuthenticated.password;

    return response.status(201).json({ user: userAuthenticated, token });
  }
}
