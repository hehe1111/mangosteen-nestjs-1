import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import KindEnum from 'src/enum/kind.enum';
import { TagEntity } from 'src/tags/entities/tag.entity';

@Entity('items')
export class ItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'user_id',
    type: 'bigint',
    comment: '用户 ID',
  })
  userId: number;

  @Column({
    name: 'tag_id', // 注意此处跟下面的名字相同
    type: 'bigint',
    comment: '标签 ID',
  })
  tagId: number; // 显式写明外键列，请求接口时只需要带关联对象的 ID 即可，不需要带整个关联对象
  @JoinColumn({
    name: 'tag_id' // 注意此处跟上面的名字相同
  })
  @ManyToOne(() => TagEntity, { cascade: true })
  tag: TagEntity;

  @Column({
    comment: '金额（单位：分）',
  })
  amount: number;

  @Column({
    type: 'text',
    nullable: true,
    comment: '备注',
  })
  note: string;

  @Column({
    name: 'happened_at',
    type: 'datetime',
    comment: '收支时间',
  })
  happenedAt: Date;

  @Column({
    type: 'enum',
    enum: KindEnum,
    comment: '收支类型',
  })
  kind: KindEnum;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    comment: '标签删除时间',
  })
  deletedAt: Date;

  @CreateDateColumn({
    name: 'created_at',
    comment: '标签创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    comment: '标签更新时间',
  })
  updatedAt: Date;
}
