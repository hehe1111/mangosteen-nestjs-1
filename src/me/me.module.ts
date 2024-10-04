import { Module } from '@nestjs/common'
import { MeController } from './me.controller'
import { MeService } from './me.service'
import { UsersModule } from 'src/users/users.module'

@Module({
  imports: [UsersModule],
  controllers: [MeController],
  providers: [MeService]
})
export class MeModule {}
