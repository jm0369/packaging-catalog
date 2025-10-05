import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard } from './admin.guard';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('admin:categories')
@ApiSecurity('admin')
@UseGuards(AdminGuard)
@Controller('admin/categories/:categoryId/media')
export class CategoriesMediaController {
  constructor(private prisma: PrismaService) {}

  @Post()
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

  @Delete(':linkId')
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
