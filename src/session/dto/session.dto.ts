import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsNumber,
} from 'class-validator';

export class SessionDto {
  @ApiProperty({ description: '邮箱地址', example: 'a@b.com' })
  @IsString()
  @IsNotEmpty({ message: '邮箱地址不能为空' })
  @IsEmail({}, { message: '邮箱地址格式不合法' })
  email: string;

  @ApiProperty({ description: '验证码。6 位数字', example: 123456 })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsNotEmpty({ message: '验证码不能为空' })
  code: number;
}
