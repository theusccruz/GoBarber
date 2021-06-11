import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../../controllers/ProvidersController';
import ProviderDayAvailabilityController from '../../controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '../../controllers/ProviderMonthAvailabilityController';

const providersRouter = Router();
providersRouter.use(ensureAuthenticated);

const providersController = new ProvidersController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();

providersRouter.get('/', async (request, response) => {
  await providersController.index(request, response);
});

providersRouter.get('/:provider_id/month-availability', async (request, response) => {
  await providerMonthAvailabilityController.index(request, response);
});

providersRouter.get('/:provider_id/day-availability', async (request, response) => {
  await providerDayAvailabilityController.index(request, response);
});

export default providersRouter;
