import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import KindEnum from 'src/enum/kind.enum';

@Entity('items')
export class ItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'bigint',
    comment: '用户 ID',
  })
  userId: number;

  @Column({
    type: 'bigint',
    comment: '标签 ID',
  })
  tagId: number;

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
    type: 'datetime',
    comment: '收支时间',
  })
  happened_at: Date;

  @Column({
    type: 'enum',
    enum: KindEnum,
    comment: '收支类型',
  })
  kind: KindEnum;

  @DeleteDateColumn({
    nullable: true,
    comment: '标签删除时间',
  })
  deletedAt: Date;

  @CreateDateColumn({
    comment: '标签创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    comment: '标签更新时间',
  })
  updatedAt: Date;
}
