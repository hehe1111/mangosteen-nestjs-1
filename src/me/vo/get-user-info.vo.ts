import { ApiProperty } from "@nestjs/swagger";

class UserInfo {
  @ApiProperty({ description: '用户 ID', type: Number })
  id: number

  @ApiProperty({ description: '用户邮箱地址', type: String })
  email: string

  @ApiProperty({ description: '用户创建日期', type: Date })
  createdAt: Date

  @ApiProperty({ description: '用户更新日期', type: Date })
  updatedAt: Date
}

export class GetUserInfoVo {
  @ApiProperty({ description: '用户信息', type: UserInfo })
  resource: UserInfo
}
