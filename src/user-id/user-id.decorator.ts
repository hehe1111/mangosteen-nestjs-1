import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const UserId = createParamDecorator(
  (_, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest<Request>();
    return +request.user.userId;
  },
);
