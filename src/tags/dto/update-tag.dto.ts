// import { PartialType } from '@nestjs/mapped-types'; // 生成文档时，会生成空对象
// https://docs.nestjs.com/openapi/mapped-types#partial
import { PartialType } from '@nestjs/swagger' // 生成文档时，可以正确生成 TS 类型
import { CreateTagDto } from './create-tag.dto'

export class UpdateTagDto extends PartialType(CreateTagDto) {}
