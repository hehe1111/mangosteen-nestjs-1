import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get<string>('NODEMAILER_HOST'),
      port: this.configService.get<number>('NODEMAILER_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('NODEMAILER_EMAIL_FROM'),
        pass: this.configService.get<string>('NODEMAILER_AUTHORIZATION_CODE'),
      },
    });
  }

  async sendMail({ to, subject, html }) {
    const envTip = process.env.NODE_ENV === 'development'
      ? `【${this.configService.get<string>('NODEMAILER_EMAIL_FROM_NAME')}】`
      : ''
    await this.transporter.sendMail({
      from: {
        name: `${envTip}记账`,
        address: this.configService.get<string>('NODEMAILER_EMAIL_FROM'),
      },
      to,
      subject,
      html,
    });
  }
}
