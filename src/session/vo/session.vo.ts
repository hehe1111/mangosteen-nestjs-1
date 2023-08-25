import { ApiProperty } from "@nestjs/swagger";

export class SessionVo {
  @ApiProperty({ description: 'JSON Web Token', type: String })
  jwt: string
}
