import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as config from 'config';
import { MailService } from './mail.service';

const mailConfig = config.get('mail');
const { mailUser, mailPassword } = mailConfig;

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => {
        return {
          transport: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user: mailUser,
              pass: mailPassword,
            },
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new EjsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
