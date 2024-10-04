import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TagsModule } from './tags/tags.module'
import { UsersModule } from './users/users.module'
import { SessionModule } from './session/session.module'
import { RedisModule } from './redis/redis.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EmailModule } from './email/email.module'
import { JwtModule } from '@nestjs/jwt'
import { ValidationCodesModule } from './validation-codes/validation-codes.module'
import { MeModule } from './me/me.module'
import { APP_GUARD } from '@nestjs/core'
import { LoginGuardGuard } from './login-guard/login-guard.guard'
import { ItemsModule } from './items/items.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? `.${process.env.NODE_ENV}.env`
          : `src/.${process.env.NODE_ENV}.env`
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',
          host: configService.get<string>('MYSQL_HOST'),
          port: configService.get<number>('MYSQL_PORT'),
          username: configService.get<string>('MYSQL_USERNAME'),
          password: configService.get<string>('MYSQL_PASSWORD'),
          database: configService.get<string>('MYSQL_DATABASE'),
          synchronize: true, // Note: This option auto-creates tables (don't use in production)
          logging: true,
          // ! 必须要用 .js 不能用 .ts
          // ! 否则会报 `EntityMetadataNotFoundError: No metadata for "TagEntity" was found.`
          // https://stackoverflow.com/a/64128240
          entities: [__dirname + '/**/*.entity.js'],
          migrations: [],
          subscribers: [],
          poolSize: 10,
          connectorPackage: 'mysql2'
          // TODO: 以下配置报 warning：
          // Ignoring invalid configuration option passed to Connection: authPlugin.This is currently a warning, but in future versions of MySQL2, an error will be thrown if you pass an invalid configuration option to a Connection
          // extra: {
          //   authPlugin: 'sha256_password',
          // },
        }
      }
    }),

    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn:
              configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN') || '30m' // 30m 默认 30 分钟
          }
        }
      }
    }),

    RedisModule,

    EmailModule,

    ValidationCodesModule,
    UsersModule,
    SessionModule,
    TagsModule,
    MeModule,
    ItemsModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: LoginGuardGuard
    },
    AppService
  ]
})
export class AppModule {}
