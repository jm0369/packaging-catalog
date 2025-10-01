// BEFORE (problematic)
// const req = context.switchToHttp().getRequest();
// const secret = req?.header?.('x-admin-secret');

// AFTER
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const headerVal = req.header?.('x-admin-secret'); // string | undefined
    const provided = typeof headerVal === 'string' ? headerVal : undefined;

    const expected = process.env.ADMIN_SHARED_SECRET ?? '';
    return Boolean(expected) && provided === expected;
  }
}
