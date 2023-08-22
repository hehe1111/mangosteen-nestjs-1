import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  IsNumberString,
} from 'class-validator';

export class SessionDto {
  @IsString()
  @IsNotEmpty({ message: '邮箱地址不能为空' })
  @IsEmail({}, { message: '邮箱地址格式不合法' })
  email: string;

  @IsNumberString()
  @Length(6, 6, { message: '验证码位数为 6 位' })
  @IsNotEmpty({ message: '验证码不能为空' })
  code: string;
}
