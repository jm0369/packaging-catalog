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
  @ApiOperation({ summary: 'Link asset (append). Body: { mediaId, altText? }' })
  async link(@Param('externalId') externalId: string, @Body() body: { mediaId: string; altText?: string | null }) {
     const g = await this.prisma.articleGroupMirror.findUnique({ where: { externalId } });
    if (!g) throw new Error('Group not found');

    const max = await this.prisma.groupMediaLink.aggregate({
      where: { groupId: g.id }, _max: { sortOrder: true },
    });
    const next = typeof max._max.sortOrder === 'number' ? max._max.sortOrder + 1 : 0;

    return this.prisma.groupMediaLink.create({
      data: { 
        groupId: g.id, 
        mediaId: body.mediaId, 
        altText: body.altText ?? null, 
        sortOrder: next 
      },
      //include: { media: true },
    });
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
        select: { id: true, groupId: true, sortOrder: true },
      });

      // Get all links for this group, ordered by sortOrder
      const allLinks = await tx.groupMediaLink.findMany({
        where: { groupId: link.groupId },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, sortOrder: true },
      });

      // Phase 1: Move all to temporary negative range to avoid conflicts
      for (let i = 0; i < allLinks.length; i++) {
        await tx.groupMediaLink.update({
          where: { id: allLinks[i].id },
          data: { sortOrder: -1000 - i },
        });
      }

      // Phase 2: Set final sortOrders - target at 0, others sequentially
      let newSortOrder = 0;
      for (const l of allLinks) {
        if (l.id === linkId) {
          await tx.groupMediaLink.update({
            where: { id: l.id },
            data: { sortOrder: 0 },
          });
        } else {
          newSortOrder++;
          await tx.groupMediaLink.update({
            where: { id: l.id },
            data: { sortOrder: newSortOrder },
          });
        }
      }

      const updated = await tx.groupMediaLink.findUniqueOrThrow({
        where: { id: linkId },
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