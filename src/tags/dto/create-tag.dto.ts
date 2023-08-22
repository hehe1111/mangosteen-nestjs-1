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
  @IsOptional()
  @IsNumber()
  @IsNotEmpty({ message: '用户 ID 不能为空' })
  userId: number;

  @IsString()
  @IsNotEmpty({ message: '标签名不能为空' })
  @Length(1, 8, { message: '标签名长度只能在 1~8 位之间' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '标签图标不能为空' })
  @Length(1, 8, { message: '标签图标长度只能在 1~8 位之间' })
  sign: string;

  @IsEnum(KindEnum, { message: '标签收支类型只能是 1 或 2。1-支出，2-收入' })
  @IsNotEmpty({ message: '标签收支类型不能为空' })
  kind: number;
}
