// apps/api/src/admin/admin.controller.ts (add method)
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { AdminGuard } from './admin.guard';
import { ReorderMediaDto } from './dto/reorder-media.dto';
import { AdminService } from './admin.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { getEnv } from 'src/config/env';

@ApiTags('admin')
@ApiSecurity('admin')
@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly admin: AdminService,
    private prisma: PrismaService,
  ) {}

  @Get('article-groups/:externalId/media')
  @ApiOperation({ summary: 'List media linked to a group (admin)' })
  @ApiOkResponse({
    schema: {
      example: {
        group: { id: 'uuid', externalId: 'PC P B03', name: 'Pack …' },
        media: [
          {
            id: 'link-uuid',
            mediaId: 'media-uuid',
            altText: null,
            sortOrder: 0,
            media: {
              id: 'media-uuid',
              key: 'groups/…jpg',
              mime: 'image/jpeg',
              sizeBytes: 137731,
              createdAt: '2025-10-01T10:39:23.675Z',
              url: 'https://your-cdn/groups/…jpg',
            },
            isPrimary: true,
          },
        ],
      },
    },
  })
  async listGroupMedia(@Param('externalId') externalId: string) {
    const cdn = getEnv().PUBLIC_CDN_BASE?.replace(/\/$/, '') ?? '';
    const group = await this.prisma.articleGroupMirror.findUnique({
      where: { externalId },
      select: { id: true, externalId: true, name: true },
    });
    if (!group) {
      return { group: null, media: [] };
    }

    const links = await this.prisma.articleGroupMediaLink.findMany({
      where: { groupId: group.id },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      include: { media: true },
    });

    const media = links.map((l) => ({
      id: l.id,
      mediaId: l.mediaId,
      altText: l.altText,
      sortOrder: l.sortOrder,
      isPrimary: l.sortOrder === 0,
      media: l.media
        ? {
            id: l.media.id,
            key: l.media.key,
            mime: l.media.mime,
            width: l.media.width,
            height: l.media.height,
            sizeBytes: l.media.sizeBytes,
            createdAt: l.media.createdAt.toISOString(),
            url: l.media.key ? `${cdn}/${l.media.key}` : null,
          }
        : null,
    }));

    return { group, media };
  }

  @Post('article-groups/:externalId/media')
  async addGroupMedia(
    @Param('externalId') externalId: string,
    @Body()
    body: { mediaId: string; altText?: string | null; sortOrder?: number },
  ) {
    const group = await this.prisma.articleGroupMirror.findUnique({
      where: { externalId },
    });
    if (!group) throw new Error('Group not found');

    // find next sort index
    const max = await this.prisma.articleGroupMediaLink.aggregate({
      where: { groupId: group.id },
      _max: { sortOrder: true },
    });

    const sortOrder =
      typeof body.sortOrder === 'number'
        ? body.sortOrder
        : (max._max.sortOrder ?? -1) + 1;

    return this.prisma.articleGroupMediaLink.create({
      data: {
        groupId: group.id,
        mediaId: body.mediaId,
        altText: body.altText ?? null,
        sortOrder,
      },
      include: { media: true },
    });
  }

  @Patch('article-groups/:externalId/media/reorder')
  @ApiOperation({
    summary: 'Reorder media links; first becomes sortOrder=0 (primary)',
  })
  async reorderMedia(
    @Param('externalId') externalId: string,
    @Body() dto: ReorderMediaDto,
  ) {
    return this.admin.reorderGroupMedia(externalId, dto.order);
  }

  @Patch('article-groups/:externalId/media/:linkId/primary')
  async setPrimary(
    @Param('externalId') externalId: string,
    @Param('linkId') linkId: string,
  ) {
    const group = await this.prisma.articleGroupMirror.findUnique({
      where: { externalId },
    });
    if (!group) throw new Error('Group not found');

    return this.prisma.$transaction(async (tx) => {
      const link = await tx.articleGroupMediaLink.findUnique({
        where: { id: linkId },
      });
      if (!link || link.groupId !== group.id)
        throw new Error('Link not found for group');

      // bump everyone >=0 by 1, then set chosen to 0
      await tx.articleGroupMediaLink.updateMany({
        where: { groupId: group.id },
        data: { sortOrder: { increment: 1 } },
      });

      return tx.articleGroupMediaLink.update({
        where: { id: link.id },
        data: { sortOrder: 0 },
        include: { media: true },
      });
    });
  }

  @Patch('article-groups/:externalId/media/:linkId')
  async updateGroupMedia(
    @Param('externalId') externalId: string,
    @Param('linkId') linkId: string,
    @Body() body: { altText?: string | null; sortOrder?: number },
  ) {
    const group = await this.prisma.articleGroupMirror.findUnique({
      where: { externalId },
    });
    if (!group) throw new Error('Group not found');

    // simple set; you can add collision resolution if needed
    return this.prisma.articleGroupMediaLink.update({
      where: { id: linkId },
      data: {
        altText: body.altText ?? undefined,
        sortOrder:
          typeof body.sortOrder === 'number' ? body.sortOrder : undefined,
      },
      include: { media: true },
    });
  }

  @Delete('article-groups/:externalId/media/:linkId')
  async deleteGroupMedia(
    @Param('externalId') externalId: string,
    @Param('linkId') linkId: string,
  ) {
    const group = await this.prisma.articleGroupMirror.findUnique({
      where: { externalId },
    });
    if (!group) throw new Error('Group not found');

    const link = await this.prisma.articleGroupMediaLink.findUnique({
      where: { id: linkId },
    });
    if (!link || link.groupId !== group.id)
      throw new Error('Link not found for group');

    await this.prisma.articleGroupMediaLink.delete({ where: { id: linkId } });
    return { ok: true };
  }
}
