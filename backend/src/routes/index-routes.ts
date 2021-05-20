import { Router } from 'express';
import appointmentsRouter from './appointments.routes';
import usersRouter from './users.routes';
import sessionsRouter from './sessions.routes';

const routes = Router();
/*
	As rotas que tiverem "/appointments" serão interceptadas,
	tudo o que vier depois de "/appointments" será passado para o
	appointmentsRouter
 */
routes.use('/appointments', appointmentsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);

export default routes;
