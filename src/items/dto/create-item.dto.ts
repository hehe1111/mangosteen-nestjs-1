import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import KindEnum from "src/enum/kind.enum";

export class CreateItemDto {
  @IsOptional()
  @IsNumber()
  userId: number

  @IsNotEmpty({ message: '标签 ID 不能为空' })
  @IsNumber()
  tagId: number;

  @IsNotEmpty({ message: '金额不能为空' })
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  note: string;

  @IsNotEmpty({ message: '收支时间不能为空' })
  @IsDateString()
  happenedAt: Date;

  @IsNotEmpty({ message: '收支类型不能为空' })
  @IsEnum(KindEnum, { message: '收支类型只能是 1 或 2。1-支出，2-收入' })
  kind: KindEnum;
}
