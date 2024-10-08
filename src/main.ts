import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { FormatResponseInterceptor } from './format-response/format-response.interceptor'
import { ConfigService } from '@nestjs/config'
import { InvokeRecordInterceptor } from './invoke-record/invoke-record.interceptor'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
// import { LoginGuardGuard } from './login-guard/login-guard.guard';
// import { RequestMethod } from '@nestjs/common';

declare module '@nestjs/swagger' {
  interface SwaggerCustomOptions {
    customSwaggerUiDistExternalUrl?: string
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  // https://docs.nestjs.com/faq/global-prefix
  app.setGlobalPrefix('api/v1', {
    // exclude: [{ path: 'health', method: RequestMethod.GET }],
  })
  // LoginGuardGuard 依赖 JwtService 来解析 JWT 字符串，这样写无法注入 JwtService
  // app.useGlobalGuards(new LoginGuardGuard());
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new FormatResponseInterceptor())
  app.useGlobalInterceptors(new InvokeRecordInterceptor())

  const API_DOC_TITLE = '记账 API 文档'
  const config = new DocumentBuilder()
    .setTitle(API_DOC_TITLE)
    .setDescription('采用 JWT 作为鉴权方式')
    .setVersion('1.0')
    // .addTag('test')
    .addBearerAuth({
      type: 'http',
      description: '基于 jwt 的认证',
      name: 'bearer'
    })
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(
    configService.get<string>('API_DOC_PATH'),
    app,
    document,
    {
      // 自定义浏览器标签页位置显示的标题
      customSiteTitle: API_DOC_TITLE,
      // 生产环境下，让以下 swagger-ui-dist 相关的三个文件走 CDN
      // swagger-ui.css
      // swagger-ui-standalone-preset.js
      // swagger-ui-bundle.js
      customSwaggerUiDistExternalUrl:
        process.env.NODE_ENV === 'production'
          ? 'https://www.unpkg.com/swagger-ui-dist@5.9.0/'
          : ''
    }
  )

  await app.listen(configService.get<number>('NESTJS_PORT'))
}
bootstrap()
