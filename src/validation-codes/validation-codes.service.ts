import { Inject, Injectable } from '@nestjs/common';
import { ValidationCodesKindEnum } from './enum/validation-codes.enum';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { generateRedisKeyForCode } from 'src/utils/utils';

interface IPayload {
  email: string;
  kind?: ValidationCodesKindEnum;
}

@Injectable()
export class ValidationCodesService {
  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  async sendValidationCodes(payload: IPayload) {
    const { email, kind } = payload;
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(generateRedisKeyForCode(email), code, 5 * 60);
    await this.emailService.sendMail({
      to: email,
      subject: '记账验证码',
      html: `<p>你的验证码是${code}</p>`,
    });
  }
}
