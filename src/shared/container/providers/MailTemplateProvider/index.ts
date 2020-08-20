import { container } from 'tsyringe';

import IMailTemplateProvider from '../MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from '../MailTemplateProvider/implementations/HandlebarsMailProviderTemplate';

const providers = {
    handlebars: HandlebarsMailTemplateProvider,
}

container.registerSingleton<IMailTemplateProvider>( 
    'MailTemplateProvider', 
    providers.handlebars, 
);
