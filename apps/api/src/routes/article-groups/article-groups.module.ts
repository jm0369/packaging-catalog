import { Module } from '@nestjs/common';
import { ArticleGroupsController } from './article-groups.controller';
import { ArticleGroupsService } from './article-groups.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ArticleGroupsController],
  providers: [ArticleGroupsService, PrismaService],
  exports: [ArticleGroupsService],
})
export class ArticleGroupsModule {}
