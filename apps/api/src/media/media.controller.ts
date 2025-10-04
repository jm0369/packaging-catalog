import {
  Controller, Post, UseGuards, UploadedFile, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { S3Service } from './s3.service';
import { PrismaService } from '../prisma/prisma.service';
import { AdminGuard } from '../routes/admin/admin.guard';
import { ApiConsumes, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Multer } from 'multer';

@ApiTags('admin:media')
@ApiSecurity('admin')
@Controller('admin/media')
@UseGuards(AdminGuard)
export class MediaController {
  constructor(
    private readonly s3: S3Service,
    private readonly prisma: PrismaService,
  ) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload an image (multipart/form-data)', description: 'Returns { id, key, mime, sizeBytes, url }' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async upload(@UploadedFile() file?: Multer.File) {
    if (!file) throw new BadRequestException('file is required');
    if (!file.mimetype.startsWith('image/')) throw new BadRequestException('only images allowed');

    const { key, url } = await this.s3.uploadImage(file.buffer, file.mimetype);

    const asset = await this.prisma.mediaAsset.create({
      data: {
        key,
        mime: file.mimetype,
        width: null,
        height: null,
        sizeBytes: file.size,
        checksum: null,
        //variants: PrismaService.prototype.$extends ? undefined : undefined, // keep null by default (prisma allows null)
      },
    });

    return { id: asset.id, key, mime: asset.mime, sizeBytes: asset.sizeBytes, url };
  }
}