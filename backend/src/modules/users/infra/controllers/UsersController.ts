import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import ReturnedUser from '@modules/users/interfaces/IReturnedUser';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const newUser = await createUser.execute({
      name,
      email,
      password,
    });
    const newUserReturned: ReturnedUser = newUser;
    delete newUserReturned.password;

    return response.status(201).json(newUserReturned);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    const returnedUser: ReturnedUser = user;
    delete returnedUser.password;

    return response.json(returnedUser);
  }
}
