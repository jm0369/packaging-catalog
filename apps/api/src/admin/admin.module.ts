import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ArticleGroupsService } from 'src/routes/article-groups/article-groups.service';

@Module({
  controllers: [AdminController],
  providers: [PrismaService, AdminGuard, AdminService, ArticleGroupsService],
  exports: [],
})
export class AdminModule {}
