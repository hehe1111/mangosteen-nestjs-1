import { Inject, Injectable } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class MeService {
  @Inject(UsersService)
  private userService: UsersService

  async getUserInfo(userId: number) {
    return await this.userService.findOneById(userId)
  }
}
