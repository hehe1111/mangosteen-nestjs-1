import { ApiProperty } from '@nestjs/swagger'

class UserInfo {
  @ApiProperty({ description: '用户 ID' })
  id: number

  @ApiProperty({ description: '用户邮箱地址' })
  email: string

  @ApiProperty({ description: '用户创建日期' })
  createdAt: Date

  @ApiProperty({ description: '用户更新日期' })
  updatedAt: Date
}

export class GetUserInfoVo {
  @ApiProperty({ description: '用户信息' })
  resource: UserInfo
}
