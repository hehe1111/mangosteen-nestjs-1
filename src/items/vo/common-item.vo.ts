import { ApiPropertyOptional } from '@nestjs/swagger'
import { ItemVo, ItemWithTagVo } from './item.vo'

export class CommonItemVo {
  @ApiPropertyOptional()
  resource: ItemVo
}

export class CommonItemWithTagVo {
  @ApiPropertyOptional()
  resource: ItemWithTagVo
}
