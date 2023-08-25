import { ApiProperty } from "@nestjs/swagger"
import { TagVo } from "./tag.vo"

export class FindOneTagVo {
  @ApiProperty()
  resource: TagVo
}
