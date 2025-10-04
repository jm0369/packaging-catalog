import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard } from './admin.guard';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('admin:groups-media')
@ApiSecurity('admin')
@UseGuards(AdminGuard)
@Controller('admin/article-groups')
export class GroupsMediaController {
  constructor(private prisma: PrismaService) { }

  @Get(':externalId/media')
  @ApiOperation({ summary: 'List linked media for a group' })
  async list(@Param('externalId') externalId: string) {
    const group = await this.prisma.articleGroupMirror.findUnique({
      where: { externalId },
      select: {
        id: true, externalId: true, name: true,
        media: {
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true, altText: true, sortOrder: true,
            media: { select: { id: true, key: true, mime: true } },
          },
        },
      },
    });
    if (!group) return { group: null, media: [] };

    const base = process.env.PUBLIC_CDN_BASE!;
    const media = group.media.map((m) => ({
      id: m.id,
      mediaId: m.media.id,
      altText: m.altText,
      sortOrder: m.sortOrder,
      isPrimary: m.sortOrder === 0,
      url: m.media.key ? `${base}/${m.media.key}` : null,
    }));
    return { group: { id: group.id, externalId: group.externalId, name: group.name }, media };
  }

  @Post(':externalId/media')
  @ApiOperation({ summary: 'Link asset as primary (sortOrder=0). Body: { mediaId, altText? }' })
  async link(@Param('externalId') externalId: string, @Body() body: { mediaId: string; altText?: string | null }) {
    const g = await this.prisma.articleGroupMirror.findUnique({ where: { externalId } });
    if (!g) throw new Error('Group not found');

    const max = await this.prisma.groupMediaLink.aggregate({
      where: { groupId: g.id }, _max: { sortOrder: true },
    });
    const nextSort = typeof max._max.sortOrder === 'number' ? max._max.sortOrder + 1 : 0;

    const link = await this.prisma.groupMediaLink.create({
      data: {
        groupId: g.id,
        mediaId: body.mediaId,
        altText: body.altText ?? null,
        sortOrder: nextSort,
      },
      include: { media: true },
    });
    return link;
  }

  @Patch(':externalId/media/reorder')
  @ApiOperation({ summary: 'Reorder by array of link ids. Body: { order: string[] }' })
  async reorder(@Param('externalId') externalId: string, @Body() body: { order: string[] }) {
    const g = await this.prisma.articleGroupMirror.findUnique({ where: { externalId }, select: { id: true } });
    if (!g) throw new Error('Group not found');

    const ops = body.order.map((id, idx) =>
      this.prisma.groupMediaLink.update({ where: { id }, data: { sortOrder: idx } }),
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
      const link = await tx.groupMediaLink.findUniqueOrThrow({
        where: { id: linkId },
        select: { id: true, groupId: true },
      });

      await tx.groupMediaLink.update({
        where: { id: linkId },
        data: { sortOrder: -1 },
      });

      await tx.groupMediaLink.updateMany({
        where: { groupId: link.groupId, id: { not: linkId } },
        data: { sortOrder: { increment: 1 } },
      });

      const updated = await tx.groupMediaLink.update({
        where: { id: linkId },
        data: { sortOrder: 0 },
        include: { media: true },
      });

      return updated;
    });
  }
  @Delete(':externalId/media/:linkId')
  @ApiOperation({ summary: 'Unlink image from group' })
  async unlink(@Param('externalId') externalId: string, @Param('linkId') linkId: string) {
    await this.prisma.groupMediaLink.delete({ where: { id: linkId } });
    return { ok: true };
  }
}