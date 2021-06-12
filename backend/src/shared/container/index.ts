import { container, delay } from 'tsyringe';

import '@modules/users/providers/index'; // container de usuário
import '@shared/providers/index';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  delay(() => AppointmentsRepository),
);
/*
  parâmetro 1: id do repositório
*/

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  delay(() => UsersRepository),
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  delay(() => UserTokensRepository),
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  delay(() => NotificationsRepository),
);
