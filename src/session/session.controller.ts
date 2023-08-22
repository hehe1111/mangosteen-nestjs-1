import { Body, Controller, Inject, Post } from '@nestjs/common';
import { SessionDto } from './dto/session.dto';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  @Inject(SessionService)
  private sessionService: SessionService;

  @Post()
  async session(@Body() payload: SessionDto) {
    const jwt = await this.sessionService.generateJwtToken(payload);
    return { jwt };
  }
}
