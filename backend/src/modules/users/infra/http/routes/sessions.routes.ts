import { Router } from 'express';

import SessionsController from '../../controllers/SessionsController';

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post('/', async (request, response) => {
  await sessionsController.create(request, response);
});

export default sessionsRouter;
