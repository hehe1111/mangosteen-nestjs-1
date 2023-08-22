import { Controller, Get, Inject, Req } from '@nestjs/common';
import { Request } from 'express';
import { MeService } from './me.service';

declare module 'express' {
  interface Request {
    user: {
      userId: number
    }
  }
}

@Controller('me')
export class MeController {
  @Inject(MeService)
  private meService: MeService;

  @Get()
  async getUserInfo(@Req() request: Request) {
    const info = await this.meService.getUserInfo(request.user.userId)
    return { resource: info }
  }
}
