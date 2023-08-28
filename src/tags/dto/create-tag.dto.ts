import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Length,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import KindEnum from 'src/enum/kind.enum';

export class CreateTagDto {
  @ApiPropertyOptional({ description: '用户 ID。会自动从请求头的 JWT 中获取' })
  @IsOptional()
  @IsNumber()
  userId: number;

  @ApiProperty({ description: '标签名' })
  @IsNotEmpty({ message: '标签名不能为空' })
  @IsString()
  @Length(1, 8, { message: '标签名长度只能在 1~8 位之间' })
  name: string;

  @ApiProperty({ description: '标签图标' })
  @IsNotEmpty({ message: '标签图标不能为空' })
  @IsString()
  @Length(1, 8, { message: '标签图标长度只能在 1~8 位之间' })
  sign: string;

  @ApiProperty({ description: '标签收支类型。1-支出，2-收入', enum: KindEnum })
  @IsNotEmpty({ message: '标签收支类型不能为空。1-支出，2-收入' })
  @IsEnum(KindEnum, { message: '标签收支类型只能是 1 或 2。1-支出，2-收入' })
  kind: KindEnum;
}
