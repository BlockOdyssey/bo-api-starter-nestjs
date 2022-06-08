import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as copyfiles from 'copyfiles';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async _send(
    from: string,
    to: string[],
    subject: string,
    template: string,
    context: any = {},
    files?: { images?: Express.Multer.File[] },
  ) {
    copyfiles(['src/common/utils/mail/templates/*', 'dist'], async (err) => {
      if (err) {
        console.log('Error occurred while copying templates', err);
        return;
      } else {
        let fileList = [];
        if (files.images) {
          fileList = files.images.map((image) => {
            return {
              filename: image.originalname,
              content: Buffer.from(image.buffer),
            };
          });
        }
        return await this.mailerService.sendMail({
          from,
          to: to.join(', '),
          subject,
          template: `${template}`,
          context,
          attachments: fileList,
        });
      }
    });
  }
}
