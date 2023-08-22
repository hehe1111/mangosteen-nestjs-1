import { Body, Controller, DefaultValuePipe, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';
import { EmailService } from './email/email.service';

enum VALIDATION_CODES_KIND {
  SIGN_IN = 'sing_in',
  RESET = 'reset'
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  @Post('/validation_codes')
  async sendValidationCodes(@Body('email') email: string, @Body('kind', new DefaultValuePipe(VALIDATION_CODES_KIND.SIGN_IN)) kind: VALIDATION_CODES_KIND) {
    const code = Math.random().toString().slice(2, 8)
    await this.redisService.set(`validation_codes_sign_in_${email}`, code, 5 * 60)
    await this.emailService.sendMail({ to: email, subject: '记账验证码', html: `<p>你的验证码是${code}</p>` })
    return '成功发送验证码'
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
