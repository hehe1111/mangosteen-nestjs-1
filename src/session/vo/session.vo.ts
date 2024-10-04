import { ApiProperty } from '@nestjs/swagger'

export class SessionVo {
  @ApiProperty({ description: 'JSON Web Token' })
  jwt: string
}
