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
      // Load the link to get the owning articleId
      const link = await tx.categoryMediaLink.findUniqueOrThrow({
        where: { id: linkId },
        select: { id: true, categoryId: true },
      });
  
      // 1) Park the target at a sentinel to avoid unique collisions
      await tx.categoryMediaLink.update({
        where: { id: linkId },
        data: { sortOrder: -1 },
      });
  
      // 2) Shift everyone else up by 1 (unique constraint remains valid)
      await tx.categoryMediaLink.updateMany({
        where: { categoryId: link.categoryId, id: { not: linkId } },
        data: { sortOrder: { increment: 1 } },
      });
  
      // 3) Put the target at zero (now unique again)
      const updated = await tx.categoryMediaLink.update({
        where: { id: linkId },
        data: { sortOrder: 0 },
        include: {
          media: true,
        },
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
