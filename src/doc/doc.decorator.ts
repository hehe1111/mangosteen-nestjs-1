import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendValidationCodesDto } from 'src/validation-codes/dto/validation-codes.dto';
import { SessionDto } from 'src/session/dto/session.dto';
import { SessionVo } from 'src/session/vo/session.vo';
import { GetUserInfoVo } from 'src/me/vo/get-user-info.vo';

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
    ApiOperation({ summary: '发送验证码', description: '请求时需要提供邮箱地址用于接收验证码邮件' }),
    ApiBody({ type: SendValidationCodesDto }),
    ApiResponse({ status: HttpStatus.CREATED, description: '成功发送验证码', type: String }),
  ],
  session: [
    ApiTags('登录'),
    ApiOperation({ summary: '获取 JWT', description: '用邮箱地址 + 验证码获取 JWT 完成登录操作' }),
    ApiBody({ type: SessionDto }),
    ApiResponse({ status: HttpStatus.CREATED, description: '成功获取 JWT', type: SessionVo }),
  ],
  getUserInfo: [
    ApiTags('当前用户'),
    ApiOperation({ summary: '获取当前登录用户的信息', description: '在请求头带上 JWT 查询对应的用户信息' }),
    // ApiHeader({ name: 'Authorization', description: 'JWT', required: true }),
    ApiBearerAuth('bearer'),
    ApiResponse({ status: HttpStatus.OK, description: '成功获取 JWT', type: GetUserInfoVo }),
  ],
}

export const Doc = (routeHandlerName: string) => {
  return applyDecorators(...decorators[routeHandlerName])
}
