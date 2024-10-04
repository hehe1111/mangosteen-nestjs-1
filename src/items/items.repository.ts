import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { ItemEntity } from './entities/item.entity'
import { InjectRepository } from '@nestjs/typeorm'
import KindEnum from 'src/enum/kind.enum'

export interface ICommonQuery {
  userId: number
  kind?: KindEnum
  happenedAfter?: Date
  happenedBefore?: Date
}

// https://stackoverflow.com/a/73239250
// https://orkhan.gitbook.io/typeorm/docs/custom-repository#how-to-create-custom-repository
// https://devpress.csdn.net/mongodb/62fc856f7e6682346618fef8.html
// 参考以上链接得出来的写法

@Injectable()
export class ItemRepository extends Repository<ItemEntity> {
  // ! constructor 里的是固定写法
  constructor(
    @InjectRepository(ItemEntity)
    private itemRepository: Repository<ItemEntity>
  ) {
    super(
      itemRepository.target,
      itemRepository.manager,
      itemRepository.queryRunner
    )
  }

  commonQuery({ userId, kind, happenedAfter, happenedBefore }: ICommonQuery) {
    let builder = this.itemRepository
      .createQueryBuilder('item') // 参数是「别名」，方便写后续链式调用里的 sql 语句
      .orderBy('item.happenedAt', 'DESC')
      .where('item.userId = :userId', { userId })
    kind && (builder = builder.andWhere('item.kind = :kind', { kind }))
    if (happenedAfter && happenedBefore) {
      builder = builder.andWhere(
        'item.happenedAt BETWEEN :happenedAfter AND :happenedBefore',
        { happenedAfter, happenedBefore }
      )
    } else if (happenedAfter) {
      builder = builder.andWhere('item.happenedAt > :happenedAfter', {
        happenedAfter
      })
    } else if (happenedBefore) {
      builder = builder.andWhere('item.happenedAt < :happenedBefore', {
        happenedBefore
      })
    }
    return builder
  }

  commonQueryById(userId: number, id: number) {
    return this.itemRepository
      .createQueryBuilder('item')
      .where('item.userId = :userId', { userId })
      .andWhere('item.id = :id', { id })
  }
}
