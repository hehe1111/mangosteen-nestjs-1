import { ApiProperty } from '@nestjs/swagger'
import KindEnum from 'src/enum/kind.enum'
import { TagVo } from 'src/tags/vo/tag.vo'

export class ItemVo {
  @ApiProperty({ description: '收支记录 ID' })
  id: number

  @ApiProperty({ description: '用户 ID' })
  userId: number

  @ApiProperty({ description: '金额（单位：分）' })
  amount: number

  @ApiProperty({ description: '备注' })
  note: string

  @ApiProperty({ description: '收支时间' })
  happenedAt: Date

  @ApiProperty({ description: '收支类型。1-支出，2-收入' })
  kind: KindEnum

  @ApiProperty({ description: '收支记录删除时间' })
  deletedAt: Date

  @ApiProperty({ description: '收支记录创建时间' })
  createdAt: Date

  @ApiProperty({ description: '收支记录更新时间' })
  updatedAt: Date

  @ApiProperty({ description: '收支记录所属标签 ID' })
  tagId: number
}

export class ItemWithTagVo extends ItemVo {
  @ApiProperty({ description: '收支记录所属标签' })
  tag: TagVo
}
