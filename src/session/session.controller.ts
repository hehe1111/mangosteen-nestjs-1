import { Body, Controller, Inject, Post } from '@nestjs/common'
import { SessionDto } from './dto/session.dto'
import { SessionService } from './session.service'
import { Doc } from 'src/doc/doc.decorator'
import { SessionVo } from './vo/session.vo'

@Controller('session')
export class SessionController {
  @Inject(SessionService)
  private sessionService: SessionService

  @Doc('session')
  @Post()
  async session(@Body() payload: SessionDto): Promise<SessionVo> {
    const jwt = await this.sessionService.generateJwtToken(payload)
    return { jwt }
  }
}
