import { ApiProperty } from '@nestjs/swagger'
import { ItemWithTagVo } from './item.vo'

export class FindAllItemsVo {
  // 作为值，应该写为 [ItemWithTagVo]，而不是 ItemWithTagVo[]
  @ApiProperty({ description: '收支记录列表数据', type: [ItemWithTagVo] })
  resources: ItemWithTagVo[]

  @ApiProperty({ description: '分页页码', default: 1 })
  page: number

  @ApiProperty({ description: '每页数据量', default: 10 })
  pageSize: number

  @ApiProperty({ description: '数据总量' })
  count: number
}
