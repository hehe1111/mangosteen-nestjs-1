import { ApiProperty } from '@nestjs/swagger'
import { TagVo } from './tag.vo'

export class CommonTagVo {
  @ApiProperty()
  resource: TagVo
}
