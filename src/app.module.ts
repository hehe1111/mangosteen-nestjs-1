import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';
import { SessionModule } from './session/session.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '111111',
      database: 'mangosteen',
      synchronize: true, // Note: This option auto-creates tables (don't use in production)
      logging: true,
      // ! 必须要用 .js 不能用 .ts
      // ! 否则会报 `EntityMetadataNotFoundError: No metadata for "TagEntity" was found.`
      // https://stackoverflow.com/a/64128240
      entities: [__dirname + '/**/*.entity.js'],
      migrations: [],
      subscribers: [],
      poolSize: 10,
      connectorPackage: 'mysql2',
      // TODO: 以下配置报 warning：
      // Ignoring invalid configuration option passed to Connection: authPlugin.This is currently a warning, but in future versions of MySQL2, an error will be thrown if you pass an invalid configuration option to a Connection
      // extra: {
      //   authPlugin: 'sha256_password',
      // },
    }),
    TagsModule,
    UsersModule,
    SessionModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
