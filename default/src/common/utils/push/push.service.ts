import admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { getPushMessages, PushVariables } from './data/push-messages';
import * as configService from './data/firebase-admin.json';

@Injectable()
export class PushService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async sendPush(pushType: string, userId: number, variables?: PushVariables) {
    if (admin.apps.length) {
      admin.app();
    } else {
      const { project_id, private_key, client_email } = configService;
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: project_id,
          privateKey: private_key,
          clientEmail: client_email,
        }),
      });
    }
    const pushToken = await this.usersRepository
      .findOne({ id: userId }, { select: ['pushToken'] })
      .then((user) => {
        return user.pushToken;
      });

    if (!pushToken) {
      console.log('Sending push notification fail: No push token');
      return false;
    } else {
      const pushMessages = getPushMessages(variables);
      for (let i in pushMessages) {
        if (pushMessages[i].type === pushType) {
          const pushData = {
            notification: {
              title: pushMessages[i].title,
              body: pushMessages[i].body,
            },
            token: pushToken,
          };
          return await admin
            .messaging()
            .send(pushData)
            .then(async (res) => {
              console.log('Sending push notification success: ', res);
              return true;
            })
            .catch((err) => {
              console.log('Sending push notification fail: ', err);
              return false;
            });
        }
      }
      console.log('Sending push notification fail: Wrong push type');
      return false;
    }
  }
}
