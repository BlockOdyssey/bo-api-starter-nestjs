import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import axios from 'axios';
import { createHmac } from 'crypto';

@Injectable()
export class SmsService {
  async sendSms(phoneNum: string, message: string) {
    const phoneNumberCheck = RegExp(/^01[0179][0-9]{7,8}$/);
    if (phoneNumberCheck.test(phoneNum)) {
      const msg = {
        phone: phoneNum,
        callback: '0220886042',
        message,
        refkey: 'blockey',
      };

      const token = await axios({
        method: 'post',
        url: 'https://sms.gabia.com/oauth/token',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(
              'blockodyssey:281a58c0c27e2706b12f7f82fbcbf72e',
            ).toString('base64'),
        },
        data: new URLSearchParams({ grant_type: 'client_credentials' }),
      })
        .then((res) => res.data.access_token)
        .catch(() => {
          throw new ConflictException('SMS send fail');
        });

      const sendMessage = await axios({
        method: 'post',
        url: 'https://sms.gabia.com/api/send/sms',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' + Buffer.from('blockodyssey:' + token).toString('base64'),
        },
        data: new URLSearchParams(msg),
      })
        .then((res) => ({ code: res.data.code, message: res.data.message }))
        .catch(() => {
          throw new ConflictException('SMS send fail');
        });

      console.log('==== SMS send result ====');
      console.log(sendMessage);
      console.log('=========================');

      if (sendMessage.code === '200') {
        return;
      } else if (sendMessage.code === '422') {
        throw new UnprocessableEntityException('Wrong phone number');
      } else {
        throw new ConflictException('SMS send fail');
      }
    } else {
      throw new UnprocessableEntityException('Wrong phone number');
    }
  }

  async generateCertiNum() {
    const msgCertiNum = String(
      Math.floor(Math.random() * (999999 + 100000 + 1) + 100000),
    );
    const encMsgCertiNum = createHmac('sha256', 'secret')
      .update(msgCertiNum)
      .digest('hex');
    return { msgCertiNum, encMsgCertiNum };
  }

  async verifyCertiNum(msgCertiNum: string, encMsgCertiNum: string) {
    const checkCertiNum = createHmac('sha256', 'secret')
      .update(msgCertiNum)
      .digest('hex');
    if (checkCertiNum === encMsgCertiNum) {
      return;
    } else {
      throw new ConflictException('Wrong certfication number');
    }
  }
}
