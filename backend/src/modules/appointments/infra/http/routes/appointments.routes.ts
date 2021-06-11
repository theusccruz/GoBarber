import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../../controllers/AppointmentsController';
import ProviderAppointmentsController from '../../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

/*
	Aqui será verificado se tem mais alguma coisa (ex: parâmetros) pós o
	"/appointments", se não tiver, /appointments vai se tornar o endereço raiz
	nesse contexto
*/
// appointmentsRouter.get('/', async (request, response) => {
//   const appointments = await appointmentsRepository.find();

//   return response.json(appointments);
// });

appointmentsRouter.post('/', async (request, response) => {
  await appointmentsController.create(request, response);
});

appointmentsRouter.get('/me', async (request, response) => {
  await providerAppointmentsController.index(request, response);
});

export default appointmentsRouter;
