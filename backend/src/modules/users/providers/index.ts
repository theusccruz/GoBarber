import { container, delay } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

container.registerSingleton<IHashProvider>(
  'HashProvider',
  delay(() => BCryptHashProvider),
);
