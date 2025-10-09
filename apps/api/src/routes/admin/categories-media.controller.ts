import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard } from './admin.guard';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('admin:categories')
@ApiSecurity('admin')
@UseGuards(AdminGuard)
@Controller('admin/categories')
export class CategoriesMediaController {
  constructor(private prisma: PrismaService) {}

  @Get(':categoryId/media')
    @ApiOperation({ summary: 'List linked media for a category' })
    async list(@Param('categoryId') categoryId: string) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
        select: {
          id: true,
          name: true,
          media: {
            orderBy: { sortOrder: 'asc' },
            select: { id: true, altText: true, sortOrder: true, media: { select: { id: true, key: true, mime: true } } },
          },
        },
      });
      if (!category) return { category: null, media: [] };
  
      const base = process.env.PUBLIC_CDN_BASE!;
      return {
        category: { id: category.id, name: category.name},
        media: category.media.map((m) => ({
          id: m.id,
          mediaId: m.media.id,
          altText: m.altText,
          sortOrder: m.sortOrder,
          isPrimary: m.sortOrder === 0,
          url: m.media.key ? `${base}/${m.media.key}` : null,
        })),
      };
    }

  @Post(':categoryId/media')
  @ApiOperation({ summary: 'Attach media to a category. Body: { mediaId, altText?, sortOrder? }' })
  async attachMedia(
    @Param('categoryId') categoryId: string,
    @Body() body: { mediaId: string; altText?: string; sortOrder?: number }
  ) {
    return this.prisma.categoryMediaLink.create({
      data: {
        categoryId,
        mediaId: body.mediaId,
        altText: body.altText,
        sortOrder: body.sortOrder ?? 0,
      },
    });
  }

  @Patch(':categoryId/media/reorder')
    @ApiOperation({ summary: 'Reorder links. Body: { order: string[] }' })
    async reorder(@Param('categoryId') categoryId: string, @Body() body: { order: string[] }) {
      const c = await this.prisma.category.findUnique({ where: { id: categoryId }, select: { id: true } });
      if (!c) throw new Error('Category not found');
  
      const ops = body.order.map((id, idx) =>
        this.prisma.categoryMediaLink.update({ where: { id }, data: { sortOrder: idx } }),
      );
      await this.prisma.$transaction(ops);
      return { ok: true };
    }
  
  @Post(':categoryId/media/:linkId/primary')
  @UseGuards(AdminGuard)
  async setPrimary(
    @Param('externalId') categoryId: string,
    @Param('linkId') linkId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const link = await tx.categoryMediaLink.findUniqueOrThrow({
        where: { id: linkId },
        select: { id: true, categoryId: true, sortOrder: true },
      });

      // Get all links for this category, ordered by sortOrder
      const allLinks = await tx.categoryMediaLink.findMany({
        where: { categoryId: link.categoryId },
        orderBy: { sortOrder: 'asc' },
        select: { id: true, sortOrder: true },
      });

      // Phase 1: Move all to temporary negative range to avoid conflicts
      for (let i = 0; i < allLinks.length; i++) {
        await tx.categoryMediaLink.update({
          where: { id: allLinks[i].id },
          data: { sortOrder: -1000 - i },
        });
      }

      // Phase 2: Set final sortOrders - target at 0, others sequentially
      let newSortOrder = 0;
      for (const l of allLinks) {
        if (l.id === linkId) {
          await tx.categoryMediaLink.update({
            where: { id: l.id },
            data: { sortOrder: 0 },
          });
        } else {
          newSortOrder++;
          await tx.categoryMediaLink.update({
            where: { id: l.id },
            data: { sortOrder: newSortOrder },
          });
        }
      }

      const updated = await tx.categoryMediaLink.findUniqueOrThrow({
        where: { id: linkId },
        include: { media: true },
      });

      return updated;
    });
  }

  @Delete(':categoryId/media/:linkId')
  @ApiOperation({ summary: 'Remove media from a category' })
  async removeMedia(
    @Param('categoryId') categoryId: string,
    @Param('linkId') linkId: string
  ) {
    await this.prisma.categoryMediaLink.delete({
      where: { id: linkId, categoryId },
    });
    return { ok: true };
  }
}
