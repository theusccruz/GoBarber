import { Router } from 'express';
import appointmentsRouter from './appointments.routes';

const routes = Router();
/*
	As rotas que tiverem "/appointments" serão interceptadas,
	tudo o que vier depois de "/appointments" será passado para o
	appointmentsRouter
 */
routes.use('/appointments', appointmentsRouter);
export default routes;
