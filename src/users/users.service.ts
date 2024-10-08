import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UsersService {
  @InjectRepository(UserEntity)
  private userEntity: Repository<UserEntity>

  async findOrCreateBy(email: string) {
    const foundUser = await this.userEntity.findOneBy({ email })
    if (!foundUser) {
      await this.userEntity.save({ email })
    }
    return await this.userEntity.findOneBy({ email })
  }

  async findOneById(id: number) {
    return await this.userEntity.findOneBy({ id })
  }
}
