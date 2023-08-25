import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SendValidationCodesDto } from 'src/validation-codes/dto/validation-codes.dto';
import { SessionDto } from 'src/session/dto/session.dto';
import { SessionVo } from 'src/session/vo/session.vo';
import { GetUserInfoVo } from 'src/me/vo/get-user-info.vo';
import { CreateTagDto } from 'src/tags/dto/create-tag.dto';
import { CreateTagVo } from 'src/tags/vo/create-tag.vo';
import { FindAllTagsVo } from 'src/tags/vo/find-all-tags.vo';
import KindEnum from 'src/enum/kind.enum';
import { FindOneTagVo } from 'src/tags/vo/find-one-tag.vo';

/**
 * @description 一个用于放置 Api 文档装饰器函数的对象
 *
 * 键值对格式约定如下：
 *
 * 路由函数名: Api 文档装饰器函数数组
 */
const decorators = {
  sendValidationCodes: [
    ApiTags('验证码'),
    ApiOperation({
      summary: '发送验证码',
      description: '请求时需要提供邮箱地址用于接收验证码邮件',
    }),
    ApiBody({ type: SendValidationCodesDto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: '成功发送验证码',
      type: String,
    }),
  ],
  session: [
    ApiTags('登录'),
    ApiOperation({
      summary: '获取 JWT',
      description: '用邮箱地址 + 验证码获取 JWT 完成登录操作',
    }),
    ApiBody({ type: SessionDto }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: '成功获取 JWT',
      type: SessionVo,
    }),
  ],
  getUserInfo: [
    // ApiHeader({ name: 'Authorization', description: 'JWT', required: true }),
    ApiBearerAuth('bearer'),
    ApiTags('当前用户'),
    ApiOperation({
      summary: '获取当前登录用户的信息',
      description: '在请求头带上 JWT 查询对应的用户信息',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '成功获取 JWT',
      type: GetUserInfoVo,
    }),
  ],
  createTag: [
    ApiBearerAuth('bearer'),
    ApiTags('标签'),
    ApiOperation({ summary: '创建标签' }),
    ApiBody({ type: CreateTagDto }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '成功创建标签',
      type: CreateTagVo,
    }),
  ],
  findAllTags: [
    ApiBearerAuth('bearer'),
    ApiTags('标签'),
    ApiOperation({ summary: '查询标签列表' }),
    ApiQuery({
      name: 'page',
      description: '分页页码',
      type: Number,
      required: false,
      example: 1,
    }),
    ApiQuery({
      name: 'pageSize',
      description: '每页数据量',
      type: Number,
      required: false,
      example: 10,
    }),
    ApiQuery({
      name: 'kind',
      description: '收支类型',
      // 此处 type 不支持 KindEnum
      // type: KindEnum,
      required: false,
      enum: KindEnum,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '成功查询标签列表',
      type: FindAllTagsVo,
    }),
  ],
  findOneTag: [
    ApiBearerAuth('bearer'),
    ApiTags('标签'),
    ApiOperation({ summary: '查询某个标签' }),
    ApiParam({
      name: 'id',
      description: '标签 ID',
      type: Number,
      required: true,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '成功查询某个标签',
      type: FindOneTagVo,
    }),
  ],
};

export const Doc = (routeHandlerName: string) => {
  return applyDecorators(...decorators[routeHandlerName]);
};
