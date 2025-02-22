import { Injectable, Logger } from '@nestjs/common';
import { getEnvOrFatal } from 'common/utils/env.util';
import { SendEmailOptions } from './interfaces/send-email.interface';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;
  private readonly FROM_EMAIL = getEnvOrFatal<string>('EMAIL_FROM');
  constructor() {
    this.resend = new Resend(getEnvOrFatal('RESEND_API_KEY'));
  }
  async sendNewLoginMail(options: SendEmailOptions) {
    const data = {
      from: this.FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      text: 'New login',
    };

    try {
      const email = await this.resend.emails.send(data);
      if (email.error) {
        Logger.error(email.error.message);
        throw new Error();
      }
      return true;
    } catch (error) {
      Logger.error('Failed to send email');
      return false;
    }
  }
}
