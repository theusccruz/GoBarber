import { container } from 'tsyringe';

import mailConfig from '@config/mail';
import EtherialMailProvider from './implementations/EtherialMailProvider';
import SESMailProvider from './implementations/SESMailProvider';
import IMailProvider from './models/IMailProvider';

const mailProviders = {
  etherial: container.resolve(EtherialMailProvider),
  ses: container.resolve(SESMailProvider),
};

container.registerInstance<IMailProvider>('MailProvider', mailProviders[mailConfig.driver]);
