import 'reflect-metadata'; // ativa o suporte aos decorators @
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { errors } from 'celebrate';
import cors from 'cors';

import '@shared/infra/typeorm/index-db';
import '@shared/container/index';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/RateLimiter';
import routes from './routes/index-routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter); // Bloqueia excesso de requisições
app.use(routes);
app.use(errors());

// middleware que trata erros
app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: error.message, // "Internal server error",
  });
});
app.listen(3333, () => {
  console.log('Backend started ✔🔴⚪⚫');
});
