import { injectable, inject } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';

import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

import mailConfig from '@config/mail';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
    
    private client: Transporter

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider
    ) {
       this.client = nodemailer.createTransport({
           SES: new aws.SES({
               apiVersion: '2010-12-01',
               region:'us-east-1'
           })
       })  
    }
    

    public async sendMail({to, from, subject, template }: ISendMailDTO): Promise<void> {
       const { name, email } = mailConfig.defaults.from;

       const message = {
            from: {
                name: from?.name || name,
                address: from?.email || email,
            },
            to: {
                name: to.name,
                address: to.email
            },
            subject,
            text: 'test',
            html: await this.mailTemplateProvider.parse(template)
        };

        await this.client.sendMail( message );

    }      
}