// apps/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaService } from './prisma/prisma.service';
import { HealthController } from './health.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TerminusModule],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {}
