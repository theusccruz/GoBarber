import express from 'express';
import routes from './routes/routes-index';
import 'reflect-metadata'; // ativa o suporte aos decorators @

import './database/index-db';

const app = express();

app.use(express.json());
app.use(routes);

app.listen(3333, () => {
	console.log('Backend started 🔥🔥🔥');
});
