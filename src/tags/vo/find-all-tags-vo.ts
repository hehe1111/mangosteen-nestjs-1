import { ApiProperty } from "@nestjs/swagger"
import { TagVo } from "./tag.vo"

export class FindAllTagsVo {
  // 作为值，应该写为 [TagVo]，而不是 TagVo[]
  @ApiProperty({ type: [TagVo] })
  resources: TagVo[]
}
