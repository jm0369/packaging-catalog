// apps/api/src/media/article-media.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ArticleMediaController } from './article-media.controller';
import { AdminGuard } from '../admin/admin.guard';

@Module({
  controllers: [ArticleMediaController],
  providers: [PrismaService, AdminGuard],
  exports: [],
})
export class ArticleMediaModule {}