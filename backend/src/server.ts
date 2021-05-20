import express from 'express';
import routes from './routes/index-routes';
import 'reflect-metadata'; // ativa o suporte aos decorators @
import uploadConfig from './config/upload';

import './database/index-db';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.listen(3333, () => {
  console.log('Backend started 🔥🔥🔥');
});
