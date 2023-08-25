import { ApiProperty } from "@nestjs/swagger"
import { TagVo } from "./tag.vo"

export class FindAllTagsVo {
  // 作为值，应该写为 [TagVo]，而不是 TagVo[]
  @ApiProperty({ description: '标签列表数据', type: [TagVo] })
  resources: TagVo[]

  @ApiProperty({ description: '分页页码', default: 1 })
  page: number

  @ApiProperty({ description: '每页数据量', default: 10 })
  pageSize: number

  @ApiProperty({ description: '数据总量' })
  count: number
}
