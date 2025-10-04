// src/sync/sync.module.ts
import { Module } from '@nestjs/common';
import { SelectLineModule } from '../selectline/selectline.module';
import { PrismaService } from '../prisma/prisma.service';
import { SyncService } from './sync.service';
import { SyncScheduler } from './sync.scheduler';

@Module({
  imports: [SelectLineModule],          // <-- brings SelectLineClient into this context
  providers: [PrismaService, SyncService, SyncScheduler],
  exports: [SyncService],
})
export class SyncModule {}