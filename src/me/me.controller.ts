import { Controller, Get, Inject, Req } from '@nestjs/common'
import { Request } from 'express'
import { MeService } from './me.service'
import { Doc } from 'src/doc/doc.decorator'
import { GetUserInfoVo } from './vo/get-user-info.vo'

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
  private meService: MeService

  @Doc('getUserInfo')
  @Get()
  async getUserInfo(@Req() request: Request): Promise<GetUserInfoVo> {
    const info = await this.meService.getUserInfo(request.user.userId)
    return { resource: info }
  }
}
