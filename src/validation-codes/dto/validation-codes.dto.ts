import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { VALIDATION_CODES_KIND } from '../enum/validation-codes.enum';

export class SendValidationCodesDto {
  @IsString()
  @IsNotEmpty({ message: '邮箱地址不能为空' })
  @IsEmail({}, { message: '邮箱地址格式不合法' })
  email: string;

  @IsEnum(VALIDATION_CODES_KIND)
  @IsOptional()
  kind: VALIDATION_CODES_KIND;
}
