import { container, delay } from 'tsyringe';

import HandleBarsMailTemplateProvider from './implementations/HandleBarsMailTemplateProvider';
import IMailTemplateProvider from './models/IMailTemplateProvider';

const mailTemplates = {
  handlebars: HandleBarsMailTemplateProvider,
};

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  delay(() => mailTemplates.handlebars),
);
