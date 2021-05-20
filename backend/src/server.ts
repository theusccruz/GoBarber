import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import routes from './routes/index-routes';
import 'reflect-metadata'; // ativa o suporte aos decorators @
import uploadConfig from './config/upload';

import './database/index-db';
import AppError from './errors/AppError';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

// middleware que trata erros
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: error.message,
    });
  },
);

app.listen(3333, () => {
  console.log('Backend started 🔥🔥🔥');
});
