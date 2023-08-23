import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UserEntity } from './users/entities/user.entity';
import { TagEntity } from './tags/entities/tag.entity';
import { ItemEntity } from './items/entities/item.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @InjectEntityManager()
  private entityManager: EntityManager;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('init-data')
  async initData() {
    const user = new UserEntity()
    user.email = '1787761330@qq.com'

    await this.entityManager.save(UserEntity, user)

    const tag = new TagEntity()
    tag.kind = 1
    tag.name = '网球'
    tag.sign = '🎾'
    tag.userId = user.id

    const tag2 = new TagEntity()
    tag2.kind = 1
    tag2.name = '游泳'
    tag2.sign = '🏊‍'
    tag2.userId = user.id

    const tag3 = new TagEntity()
    tag3.kind = 1
    tag3.name = '跑步'
    tag3.sign = '🏃‍'
    tag3.userId = user.id

    await this.entityManager.save(TagEntity, tag)
    await this.entityManager.save(TagEntity, tag2)
    await this.entityManager.save(TagEntity, tag3)

    const item = new ItemEntity()
    item.amount = 1000
    item.happenedAt = new Date('2023-08-23T19:21:54+0800')
    item.kind = 1
    item.note = '第一笔支出'
    item.tag = tag
    item.userId = user.id

    const item2 = new ItemEntity()
    item2.amount = 2000
    item2.happenedAt = new Date('2023-08-23T20:21:54+0800')
    item2.kind = 1
    item2.note = '第二笔支出'
    item2.tag = tag2
    item2.userId = user.id

    const item3 = new ItemEntity()
    item3.amount = 3000
    item3.happenedAt = new Date('2023-08-23T21:21:54+0800')
    item3.kind = 1
    item3.note = '第三笔支出'
    item3.tag = tag3
    item3.userId = user.id

    await this.entityManager.save(ItemEntity, item)
    await this.entityManager.save(ItemEntity, item2)
    await this.entityManager.save(ItemEntity, item3)
  }
}
