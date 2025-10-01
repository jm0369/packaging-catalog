import { Module } from '@nestjs/common';
import { ArticleGroupsController } from './article-groups.controller';
import { ArticleGroupsService } from './article-groups.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ArticlesModule } from '../articles/articles.module';

@Module({
  imports: [ArticlesModule],
  controllers: [ArticleGroupsController],
  providers: [ArticleGroupsService, PrismaService],
  exports: [ArticleGroupsService],
})
export class ArticleGroupsModule {}
