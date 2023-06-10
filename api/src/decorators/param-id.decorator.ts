import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const ParamId = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const { id } = context.switchToHttp().getRequest().params;

    return Number(id);
  },
);
