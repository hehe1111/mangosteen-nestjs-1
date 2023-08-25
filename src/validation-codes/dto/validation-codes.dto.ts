import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationCodesKindEnum } from '../enum/validation-codes.enum';

export class SendValidationCodesDto {
  @ApiProperty({ description: '邮箱地址', required: true, type: String, example: 'a@b.com' })
  @IsString()
  @IsNotEmpty({ message: '邮箱地址不能为空' })
  @IsEmail({}, { message: '邮箱地址格式不合法' })
  email: string;

  @ApiPropertyOptional({ description: '邮件类型。暂不支持，可先忽略', type: ValidationCodesKindEnum, enum: ValidationCodesKindEnum, default: ValidationCodesKindEnum.SignIn })
  @IsEnum(ValidationCodesKindEnum)
  @IsOptional()
  kind: ValidationCodesKindEnum;
}
