import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { S3Service } from './s3.service';
import { PrismaService } from '../prisma/prisma.service';
import { AdminGuard } from '../admin/admin.guard';

@Module({
  controllers: [MediaController],
  providers: [MediaService, S3Service, PrismaService, AdminGuard],
})
export class MediaModule {}
