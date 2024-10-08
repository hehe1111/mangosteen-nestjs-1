import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor
} from '@nestjs/common'
import { Observable, tap } from 'rxjs'

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InvokeRecordInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()

    const userAgent = request.headers['user-agent']
    const { ip, method, path } = request
    const target = `${ip} ${userAgent} ${method} ${path}: `

    this.logger.debug(
      `${target}${context.getClass().name}#${
        context.getHandler().name
      } invoked...`
    )
    this.logger.debug(`user: ${request.user?.userId}`)

    const now = Date.now()

    return next.handle().pipe(
      tap((res) => {
        this.logger.debug(
          `${target}${response.statusCode} [${Date.now() - now}ms]`
        )
        this.logger.debug(`Response: ${JSON.stringify(res)}`)
      })
    )
  }
}
