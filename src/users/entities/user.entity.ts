import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 50,
    comment: '邮箱地址'
  })
  email: string

  @CreateDateColumn({
    name: 'created_at',
    comment: '用户创建时间'
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    comment: '用户更新时间'
  })
  updatedAt: Date
}
