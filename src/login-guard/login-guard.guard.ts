import { CanActivate, ExecutionContext, Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

const WHITE_LIST = ['', '/validation_codes', '/session']

@Injectable()
export class LoginGuardGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()

    if (WHITE_LIST.includes(request.path.replace('/api/v1', ''))) {
      return true
    }

    const authorization = request.headers.authorization

    if (!authorization) {
      throw new UnauthorizedException('请先登录')
    }

    let data
    try {
      const jwt = authorization.split(' ')?.[1]
      data = this.jwtService.verify(jwt);
    } catch (e) {
      throw new UnauthorizedException('无效登陆凭证，请重新登录')
    }

    // ! 给请求加上用户信息，方便后续用来查找用户
    request.user = { userId: data.userId }

    return true;
  }
}
