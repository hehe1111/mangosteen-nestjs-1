import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FormatResponseInterceptor } from './format-response/format-response.interceptor';
import { ConfigService } from '@nestjs/config';
import { InvokeRecordInterceptor } from './invoke-record/invoke-record.interceptor';
import { ValidationPipe } from '@nestjs/common';
// import { LoginGuardGuard } from './login-guard/login-guard.guard';
// import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // https://docs.nestjs.com/faq/global-prefix
  app.setGlobalPrefix('api/v1', {
    // exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  // LoginGuardGuard 依赖 JwtService 来解析 JWT 字符串，这样写无法注入 JwtService
  // app.useGlobalGuards(new LoginGuardGuard());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());

  await app.listen(configService.get<number>('NESTJS_PORT'));
}
bootstrap();
