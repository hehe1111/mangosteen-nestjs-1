import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { RedisService } from 'src/redis/redis.service'
import { UsersService } from 'src/users/users.service'
import { generateRedisKeyForCode } from 'src/utils/utils'

@Injectable()
export class SessionService {
  @Inject(RedisService)
  private redisService: RedisService

  @Inject(JwtService)
  private jwtService: JwtService

  @Inject(UsersService)
  private userService: UsersService

  @Inject(ConfigService)
  private configService: ConfigService

  async generateJwtToken(payload: { email: string; code: number }) {
    const { email, code } = payload
    const codeInRedis = await this.redisService.get(
      generateRedisKeyForCode(email)
    )

    if (!codeInRedis) {
      throw new UnauthorizedException('验证码已过期')
    }

    if (code !== +codeInRedis) {
      throw new UnauthorizedException('验证码错误')
    }

    const foundUser = await this.userService.findOrCreateBy(email)
    return this.jwtService.sign(
      {
        userId: foundUser.id
      },
      {
        expiresIn:
          this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN') || '30m'
      }
    )
  }
}
