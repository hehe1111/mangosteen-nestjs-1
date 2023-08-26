import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import KindEnum from "src/enum/kind.enum";

export class CreateItemDto {
  @ApiPropertyOptional({ description: '用户ID。会自动从请求头的 JWT 中获取' })
  @IsOptional()
  @IsNumber()
  userId: number

  @ApiProperty({ description: '收支记录所属标签' })
  @IsNotEmpty({ message: '标签ID不能为空' })
  @IsNumber()
  tagId: number

  @ApiProperty({ description: '金额（单位：分）' })
  @IsNotEmpty({ message: '金额不能为空' })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  note: string;

  @ApiProperty({ description: '收支时间' })
  @IsNotEmpty({ message: '收支时间不能为空' })
  @IsDateString()
  happenedAt: Date;

  @ApiProperty({ description: '收支类型' })
  @IsNotEmpty({ message: '收支类型不能为空' })
  @IsEnum(KindEnum, { message: '收支类型只能是 1 或 2。1-支出，2-收入' })
  kind: KindEnum;
}
