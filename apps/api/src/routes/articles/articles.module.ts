import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SelectLineModule } from 'src/sync/selectline.module';

@Module({
  imports: [SelectLineModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, PrismaService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
