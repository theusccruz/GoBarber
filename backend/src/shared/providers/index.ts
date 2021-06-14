import { container, delay } from 'tsyringe';
import mailConfig from '@config/mail';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

import IMailProvider from './MailProvider/models/IMailProvider';
import EtherialMailProvider from './MailProvider/implementations/EtherialMailProvider';
import SESMailProvider from './MailProvider/implementations/SesMailProvider';

import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandleBarsMailTemplateProvider from './MailTemplateProvider/implementations/HandleBarsMailTemplateProvider';

container.registerSingleton<IStorageProvider>('StorageProvider', DiskStorageProvider);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  delay(() => HandleBarsMailTemplateProvider),
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  mailConfig.driver === 'etherial'
    ? container.resolve(EtherialMailProvider)
    : container.resolve(SESMailProvider),
);
