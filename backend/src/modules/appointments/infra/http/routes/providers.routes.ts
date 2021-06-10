import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../../controllers/ProvidersController';

const providersRouter = Router();
const providersController = new ProvidersController();
providersRouter.use(ensureAuthenticated);

providersRouter.get('/', async (request, response) => {
  await providersController.index(request, response);
});

export default providersRouter;
