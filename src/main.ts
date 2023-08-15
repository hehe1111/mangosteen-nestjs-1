import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // https://docs.nestjs.com/faq/global-prefix
  app.setGlobalPrefix('api/v1', {
    // exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  await app.listen(3000);
}
bootstrap();
