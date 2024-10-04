import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { TagVo } from 'src/tags/vo/tag.vo'

// TODO: 能否拆成两个？
// ! 只用于生成 swagger 文档，不会在代码中作为 TS 类型
class HappenedAtAmountVo {
  @ApiPropertyOptional({ description: '收支时间' })
  happenedAt: Date

  @ApiPropertyOptional({ description: '标签' })
  tag: TagVo

  @ApiProperty({ description: '当天收支总金额，或标签对应的收支总金额' })
  amount: number
}

export class SummaryItemVo {
  @ApiProperty({
    description: '按分组统计收支记录金额列表数据',
    type: [HappenedAtAmountVo]
  })
  resources: Array<
    { happenedAt: Date; amount: number } | { tag: TagVo; amount: number }
  >

  @ApiProperty({ description: '总金额' })
  total: number
}
