import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export interface JwtUser {
  _id: string;
  email: string;
  role: string;
}

export const GetUser = createParamDecorator(
  (data: keyof JwtUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtUser;

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    if (data) {
      if (!user[data]) {
        throw new UnauthorizedException(`User ${data} not found`);
      }
      return user[data];
    }

    return user;
  },
); 