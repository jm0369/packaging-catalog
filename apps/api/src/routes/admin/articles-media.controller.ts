import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard } from './admin.guard';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('admin:articles-media')
@ApiSecurity('admin')
@UseGuards(AdminGuard)
@Controller('admin/articles')
export class ArticlesMediaController {
  constructor(private prisma: PrismaService) {}

  @Get(':externalId/media')
  @ApiOperation({ summary: 'List linked media for an article' })
  async list(@Param('externalId') externalId: string) {
    const article = await this.prisma.articleMirror.findUnique({
      where: { externalId },
      select: {
        id: true, externalId: true, title: true,
        media: {
          orderBy: { sortOrder: 'asc' },
          select: { id: true, altText: true, sortOrder: true, media: { select: { id: true, key: true, mime: true } } },
        },
      },
    });
    if (!article) return { article: null, media: [] };

    const base = process.env.PUBLIC_CDN_BASE!;
    return {
      article: { id: article.id, externalId: article.externalId, title: article.title },
      media: article.media.map((m) => ({
        id: m.id,
        mediaId: m.media.id,
        altText: m.altText,
        sortOrder: m.sortOrder,
        isPrimary: m.sortOrder === 0,
        url: m.media.key ? `${base}/${m.media.key}` : null,
      })),
    };
  }

  @Post(':externalId/media')
  @ApiOperation({ summary: 'Link asset (append). Body: { mediaId, altText? }' })
  async link(@Param('externalId') externalId: string, @Body() body: { mediaId: string; altText?: string | null }) {
    const a = await this.prisma.articleMirror.findUnique({ where: { externalId }, select: { id: true } });
    if (!a) throw new Error('Article not found');

    const max = await this.prisma.articleMediaLink.aggregate({
      where: { articleId: a.id }, _max: { sortOrder: true },
    });
    const next = typeof max._max.sortOrder === 'number' ? max._max.sortOrder + 1 : 0;

    return this.prisma.articleMediaLink.create({
      data: { articleId: a.id, mediaId: body.mediaId, altText: body.altText ?? null, sortOrder: next },
    });
  }

  @Patch(':externalId/media/reorder')
  @ApiOperation({ summary: 'Reorder links. Body: { order: string[] }' })
  async reorder(@Param('externalId') externalId: string, @Body() body: { order: string[] }) {
    const a = await this.prisma.articleMirror.findUnique({ where: { externalId }, select: { id: true } });
    if (!a) throw new Error('Article not found');

    const ops = body.order.map((id, idx) =>
      this.prisma.articleMediaLink.update({ where: { id }, data: { sortOrder: idx } }),
    );
    await this.prisma.$transaction(ops);
    return { ok: true };
  }

@Post(':externalId/media/:linkId/primary')
@UseGuards(AdminGuard)
async setPrimary(
  @Param('externalId') externalId: string,
  @Param('linkId') linkId: string,
) {
  return this.prisma.$transaction(async (tx) => {
    const link = await tx.articleMediaLink.findUniqueOrThrow({
      where: { id: linkId },
      select: { id: true, articleId: true, sortOrder: true },
    });

    // Get all links for this article, ordered by sortOrder
    const allLinks = await tx.articleMediaLink.findMany({
      where: { articleId: link.articleId },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, sortOrder: true },
    });

    // Phase 1: Move all to temporary negative range to avoid conflicts
    for (let i = 0; i < allLinks.length; i++) {
      await tx.articleMediaLink.update({
        where: { id: allLinks[i].id },
        data: { sortOrder: -1000 - i },
      });
    }

    // Phase 2: Set final sortOrders - target at 0, others sequentially
    let newSortOrder = 0;
    for (const l of allLinks) {
      if (l.id === linkId) {
        await tx.articleMediaLink.update({
          where: { id: l.id },
          data: { sortOrder: 0 },
        });
      } else {
        newSortOrder++;
        await tx.articleMediaLink.update({
          where: { id: l.id },
          data: { sortOrder: newSortOrder },
        });
      }
    }

    const updated = await tx.articleMediaLink.findUniqueOrThrow({
      where: { id: linkId },
      include: { media: true },
    });

    return updated;
  });
}

  @Delete(':externalId/media/:linkId')
  @ApiOperation({ summary: 'Unlink image from article' })
  async unlink(@Param('externalId') externalId: string, @Param('linkId') linkId: string) {
    await this.prisma.articleMediaLink.delete({ where: { id: linkId } });
    return { ok: true };
  }
}