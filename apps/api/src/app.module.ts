// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnv } from './config/env';
import { PrismaService } from './prisma/prisma.service';
import { HealthController } from './health.controller';
import { ArticlesPublicController } from './routes/public/articles.controller';
import { ArticleGroupsPublicController } from './routes/public/article-groups.controller';
import { MediaController } from './media/media.controller';
import { GroupsMediaController } from './routes/admin/groups-media.controller';
import { ArticlesMediaController } from './routes/admin/articles-media.controller';
import { S3Service } from './media/s3.service';
import { AdminGuard } from './routes/admin/admin.guard';

import { SelectLineModule } from './selectline/selectline.module';
import { SyncModule } from './sync/sync.module';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ScheduleModule.forRoot(),
    SelectLineModule,   // exports SelectLineClient
    SyncModule,         // exports SyncService
  ],
  controllers: [
    HealthController,
    ArticleGroupsPublicController,
    ArticlesPublicController,
    MediaController,
    GroupsMediaController,
    ArticlesMediaController,
  ],
  providers: [PrismaService, S3Service, AdminGuard],
})
export class AppModule {}