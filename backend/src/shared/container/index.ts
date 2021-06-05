import { container } from 'tsyringe';

import '@modules/users/providers/index'; // container de usuário
import '@shared/providers/index';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

container.registerSingleton<IAppointmentsRepository>(
  'AppointmentsRepository',
  AppointmentsRepository,
);
/*
  parâmetro 1: id do repositório
*/

container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepository);
