import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from './s3.service';
import * as crypto from 'crypto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    private s3: S3Service,
  ) {}

  private makeKey(prefix: string, originalName: string) {
    const ext = (originalName?.split('.').pop() || 'bin').toLowerCase();
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const rnd = crypto.randomBytes(4).toString('hex');
    return `${prefix}/${ts}-${rnd}.${ext}`;
  }

  async uploadToS3AndCreateAsset(
    file: Express.Multer.File,
    prefix = 'uploads',
  ) {
    if (!file || !file.buffer) throw new Error('file required');

    const key = this.makeKey(prefix, file.originalname);
    await this.s3.putObject(key, file.buffer, file.mimetype);

    // Optional: compute checksum
    const checksum = crypto
      .createHash('sha256')
      .update(file.buffer)
      .digest('hex');

    const asset = await this.prisma.mediaAsset.create({
      data: {
        key,
        mime: file.mimetype || 'application/octet-stream',
        width: null, // could be filled via sharp if you want
        height: null,
        sizeBytes: file.size ?? file.buffer.length,
        checksum,
        variants: Prisma.JsonNull,
      },
    });

    return asset;
  }

  async linkGroupPrimary(externalGroupId: string, mediaId: string) {
    const group = await this.prisma.articleGroupMirror.findUnique({
      where: { externalId: externalGroupId },
      select: { id: true },
    });
    if (!group) throw new NotFoundException('group not found');

    // Ensure only one primary (sortOrder=0)
    await this.prisma.articleGroupMediaLink.deleteMany({
      where: { groupId: group.id, sortOrder: 0 },
    });

    // Create link
    const link = await this.prisma.articleGroupMediaLink.create({
      data: { groupId: group.id, mediaId, sortOrder: 0, altText: null },
      include: { media: true },
    });

    return link;
  }
}
