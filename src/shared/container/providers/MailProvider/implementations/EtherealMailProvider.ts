import { injectable, inject } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';

import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
    
    private client: Transporter

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider
    ) {
        nodemailer.createTestAccount()
            .then( account => {
                    const transporter = nodemailer.createTransport({
                        host: account.smtp.host,
                        port: account.smtp.port,
                        secure: account.smtp.secure,
                        auth: {
                            user: account.user,
                            pass: account.pass
                        }
                    });

                    this.client = transporter;
                }
            )
    }
    
    public async sendMail({to, from, subject, template }: ISendMailDTO): Promise<void> {
       const message = {
            from: {
                name: from?.name || 'Equipe GoBarber',
                address: from?.email || '<equipe@gobarber.com.br>',
            },
            to: {
                name: to.name,
                address: to.email
            },
            subject,
            text: 'test',
            html: await this.mailTemplateProvider.parse(template)
        };

        const sendEmail = await this.client.sendMail( message );

        console.log('Message sent: %s', sendEmail.messageId);
        console.log('Preview URL : %s', nodemailer.getTestMessageUrl(sendEmail));
    }      
}