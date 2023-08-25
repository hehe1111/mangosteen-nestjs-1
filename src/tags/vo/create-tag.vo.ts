import { ApiProperty } from "@nestjs/swagger"
import KindEnum from "src/enum/kind.enum"

class ITag {
  @ApiProperty({ description: '用户 ID', required: false, type: Number })
  userId: number

  @ApiProperty({ description: '标签 ID', type: Number })
  id: number

  @ApiProperty({ description: '标签名', type: String })
  name: string

  @ApiProperty({ description: '标签图标', type: String })
  sign: string

  @ApiProperty({ description: '标签收支类型。1-支出，2-收入', type: KindEnum, enum: KindEnum })
  kind: KindEnum

  @ApiProperty({ description: '标签删除时间', type: Date })
  deletedAt: Date

  @ApiProperty({ description: '标签创建时间', type: Date })
  createdAt: Date

  @ApiProperty({ description: '标签更新时间', type: Date })
  updatedAt: Date
}

export class CreateTagVo {
  @ApiProperty({ type: ITag })
  resource: ITag
}
