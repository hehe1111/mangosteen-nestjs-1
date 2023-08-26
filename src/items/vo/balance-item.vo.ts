import { ApiProperty } from "@nestjs/swagger"

export class BalanceItemVo {
  @ApiProperty({ description: '支出' })
  expense: number

  @ApiProperty({ description: '收入' })
  income: number

  @ApiProperty({ description: '结余' })
  balance: number
}
