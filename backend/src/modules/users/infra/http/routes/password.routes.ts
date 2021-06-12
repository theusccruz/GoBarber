import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ResetPasswordController from '../../controllers/ResetPasswordController';
import ForgotPasswordController from '../../controllers/ForgotPasswordController';

const passwordRouter = Router();
const resetPasswordController = new ResetPasswordController();
const forgotPasswordController = new ForgotPasswordController();

passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  async (request, response) => {
    await forgotPasswordController.create(request, response);
  },
);

passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
      token: Joi.string().uuid().required(),
    },
  }),
  async (request, response) => {
    await resetPasswordController.create(request, response);
  },
);

export default passwordRouter;
