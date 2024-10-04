import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany
} from 'typeorm'
import KindEnum from 'src/enum/kind.enum'
import { ItemEntity } from 'src/items/entities/item.entity'

@Entity('tags')
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    name: 'user_id',
    type: 'bigint',
    comment: '用户 ID'
  })
  userId: number

  @OneToMany(() => ItemEntity, (item) => item.tag)
  items: ItemEntity[]

  @Column({
    length: 8,
    comment: '标签名称'
  })
  name: string

  @Column({
    length: 8,
    comment: '标签图标'
  })
  sign: string

  @Column({
    type: 'enum',
    enum: KindEnum,
    comment: '标签收支类型'
  })
  kind: KindEnum

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    comment: '标签删除时间'
  })
  deletedAt: Date

  @CreateDateColumn({
    name: 'created_at',
    comment: '标签创建时间'
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    comment: '标签更新时间'
  })
  updatedAt: Date
}
