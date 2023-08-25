import { ApiProperty } from '@nestjs/swagger';
import { TagVo } from './tag.vo';

export class CreateTagVo {
  @ApiProperty()
  resource: TagVo;
}
