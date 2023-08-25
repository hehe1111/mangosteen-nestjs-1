import { ApiProperty } from "@nestjs/swagger"
import KindEnum from "src/enum/kind.enum"

export class TagVo {
  @ApiProperty({ description: '用户 ID' })
  userId: number

  @ApiProperty({ description: '标签 ID' })
  id: number

  @ApiProperty({ description: '标签名' })
  name: string

  @ApiProperty({ description: '标签图标' })
  sign: string

  @ApiProperty({ description: '标签收支类型。1-支出，2-收入', enum: KindEnum })
  kind: KindEnum

  @ApiProperty({ description: '标签删除时间', default: null })
  deletedAt: Date

  @ApiProperty({ description: '标签创建时间' })
  createdAt: Date

  @ApiProperty({ description: '标签更新时间' })
  updatedAt: Date
}
