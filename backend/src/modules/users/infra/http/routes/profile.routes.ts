import { Router } from 'express';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import ProfileController from '../../controllers/ProfileController';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', async (request, response) => {
  await profileController.show(request, response);
});

profileRouter.put('/', async (request, response) => {
  await profileController.update(request, response);
});

export default profileRouter;
