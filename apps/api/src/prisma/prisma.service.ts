// apps/api/src/prisma/prisma.service.ts
import {
  INestApplication,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Optional: close Nest on process exit (for graceful shutdown in dev)
  enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', () => {
      void app.close();
    });
  }
}
