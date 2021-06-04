import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import 'reflect-metadata'; // ativa o suporte aos decorators @
import cors from 'cors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes/index-routes';
import '@shared/infra/typeorm/index-db';
import '@shared/container/index';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

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
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('Backend started 🔥🔥🔥');
});
