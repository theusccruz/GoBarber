import { Router } from 'express';

import ResetPasswordController from '../../controllers/ResetPasswordController';
import ForgotPasswordController from '../../controllers/ForgotPasswordController';

const passwordRouter = Router();
const resetPasswordController = new ResetPasswordController();
const forgotPasswordController = new ForgotPasswordController();

passwordRouter.post('/forgot', async (request, response) => {
  await forgotPasswordController.create(request, response);
});

passwordRouter.post('/reset', async (request, response) => {
  await resetPasswordController.create(request, response);
});

export default passwordRouter;
