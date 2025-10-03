// apps/api/src/media/article-media.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminGuard } from '../admin/admin.guard';
import { getEnv } from '../config/env';

@UseGuards(AdminGuard)
@Controller('admin/articles')
export class ArticleMediaController {
  constructor(private prisma: PrismaService) {}

  // List media for an article (by externalId)
  @Get(':externalId/media')
  async list(@Param('externalId') externalId: string) {
    const article = await this.prisma.articleMirror.findUnique({
      where: { externalId },
      select: { id: true, externalId: true, title: true },
    });
    if (!article) throw new BadRequestException('unknown article');

    const { PUBLIC_CDN_BASE: cdn } = getEnv();
    const media = await this.prisma.articleMediaLink.findMany({
      where: { articleId: article.id },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      select: {
        id: true,
        mediaId: true,
        altText: true,
        sortOrder: true,
        media: { select: { key: true, mime: true } },
      },
    });

    return {
      article,
      media: media.map((m, i) => ({
        id: m.id,
        mediaId: m.mediaId,
        altText: m.altText,
        sortOrder: m.sortOrder,
        isPrimary: m.sortOrder === 0 || i === 0,
        url: m.media?.key ? `${cdn}/${m.media.key}` : null,
        mime: m.media?.mime ?? null,
      })),
    };
  }

  // Link an existing MediaAsset to article (primary if sortOrder=0)
  @Post(':externalId/media')
  async link(
    @Param('externalId') externalId: string,
    @Body()
    dto: { mediaId: string; altText?: string | null; sortOrder?: number },
  ) {
    if (!dto?.mediaId) throw new BadRequestException('mediaId required');

    const article = await this.prisma.articleMirror.findUnique({
      where: { externalId },
      select: { id: true },
    });
    if (!article) throw new BadRequestException('unknown article');

    const current = await this.prisma.articleMediaLink.findMany({
      where: { articleId: article.id },
      select: { sortOrder: true },
      orderBy: { sortOrder: 'desc' },
      take: 1,
    });
    const nextSort = (current[0]?.sortOrder ?? -1) + 1;

    return this.prisma.articleMediaLink.create({
      data: {
        articleId: article.id,
        mediaId: dto.mediaId,
        altText: dto.altText ?? null,
        sortOrder: dto.sortOrder ?? nextSort,
      },
      include: { media: true },
    });
  }

  // Set as primary (force sortOrder=0, shift the others)
  @Post(':externalId/media/:linkId/primary')
  async setPrimary(
    @Param('externalId') externalId: string,
    @Param('linkId') linkId: string,
  ) {
    const article = await this.prisma.articleMirror.findUnique({
      where: { externalId },
      select: { id: true },
    });
    if (!article) throw new BadRequestException('unknown article');

    const links = await this.prisma.articleMediaLink.findMany({
      where: { articleId: article.id },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });

    const target = links.find((l) => l.id === linkId);
    if (!target) throw new BadRequestException('link not found');

    // set target to 0, renumber others 1..n
    const reordered = [target, ...links.filter((l) => l.id !== linkId)];
    await this.prisma.$transaction(
      reordered.map((l, idx) =>
        this.prisma.articleMediaLink.update({
          where: { id: l.id },
          data: { sortOrder: idx },
        }),
      ),
    );
    return { ok: true };
  }

  // Drag & drop reorder: [{linkId, sortOrder}, ...]
  @Put(':externalId/media/reorder')
  async reorder(
    @Param('externalId') externalId: string,
    @Body() dto: { order: Array<{ id: string; sortOrder: number }> },
  ) {
    if (!dto?.order?.length) throw new BadRequestException('order required');
    const article = await this.prisma.articleMirror.findUnique({
      where: { externalId },
      select: { id: true },
    });
    if (!article) throw new BadRequestException('unknown article');

    await this.prisma.$transaction(
      dto.order.map((item) =>
        this.prisma.articleMediaLink.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );
    return { ok: true };
  }

  // Unlink one media
  @Delete(':externalId/media/:linkId')
  async unlink(
    @Param('externalId') externalId: string,
    @Param('linkId') linkId: string,
  ) {
    const article = await this.prisma.articleMirror.findUnique({
      where: { externalId },
      select: { id: true },
    });
    if (!article) throw new BadRequestException('unknown article');

    await this.prisma.articleMediaLink.delete({ where: { id: linkId } });
    return { ok: true };
  }
}
