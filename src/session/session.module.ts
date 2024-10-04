import { Module } from '@nestjs/common'
import { UsersModule } from 'src/users/users.module'
import { SessionService } from './session.service'
import { SessionController } from './session.controller'

@Module({
  imports: [UsersModule],
  providers: [SessionService],
  controllers: [SessionController]
})
export class SessionModule {}
