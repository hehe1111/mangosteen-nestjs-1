import { ApiPropertyOptional } from "@nestjs/swagger";
import { ItemVo } from "./item.vo";

export class CommonItemVo {
  @ApiPropertyOptional()
  resource: ItemVo
}
