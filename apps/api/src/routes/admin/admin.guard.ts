import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { getEnv } from '../../config/env';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const secret = req.header?.('x-admin-secret') ?? req.headers?.['x-admin-secret'];
    if (!secret || secret !== getEnv().ADMIN_SHARED_SECRET) {
      throw new UnauthorizedException('invalid admin secret');
    }
    return true;
  }
}