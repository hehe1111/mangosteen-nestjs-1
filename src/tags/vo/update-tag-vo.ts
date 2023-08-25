import { ApiProperty } from "@nestjs/swagger"
import { TagVo } from "./tag.vo"

export class UpdateTagVo {
  @ApiProperty()
  resource: TagVo
}
