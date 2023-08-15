import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import KindEnum from '../enum/kind.enum';

@Entity('tags')
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // TODO:
  // @ManyToOne(() => User)
  @Column({
    type: 'bigint',
    comment: '用户 ID',
  })
  userId: number;

  @Column({
    length: 8,
    comment: '标签名称',
  })
  name: string;

  @Column({
    length: 8,
    comment: '标签图标',
  })
  sign: string;

  @Column({
    type: 'enum',
    enum: KindEnum,
    comment: '标签收支类型',
  })
  kind: KindEnum;

  @DeleteDateColumn({
    type: 'datetime',
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
