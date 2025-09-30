// apps/api/src/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaService } from './prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    // Simple DB ping via raw query
    await this.prisma.$queryRawUnsafe('select 1');
    return { status: 'ok' };
  }
}
