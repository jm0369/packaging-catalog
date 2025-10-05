import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard } from './admin.guard';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('admin:groups-categories')
@ApiSecurity('admin')
@UseGuards(AdminGuard)
@Controller('admin/article-groups')
export class GroupsCategoriesController {
  constructor(private prisma: PrismaService) {}

  @Get(':externalId/categories')
  @ApiOperation({ summary: 'List categories for a group' })
  async list(@Param('externalId') externalId: string) {
    const group = await this.prisma.articleGroupMirror.findUnique({
      where: { externalId },
      select: {
        id: true,
        externalId: true,
        name: true,
        categories: {
          select: {
            id: true,
            category: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    });
    if (!group) return { group: null, categories: [] };

    const categories = group.categories.map((c) => ({
      linkId: c.id,
      ...c.category,
    }));
    return { 
      group: { id: group.id, externalId: group.externalId, name: group.name }, 
      categories 
    };
  }

  @Post(':externalId/categories')
  @ApiOperation({ summary: 'Assign a category to a group. Body: { categoryId }' })
  async assign(@Param('externalId') externalId: string, @Body() body: { categoryId: string }) {
    const group = await this.prisma.articleGroupMirror.findUnique({ 
      where: { externalId },
      select: { id: true }
    });
    if (!group) throw new Error('Group not found');

    // Check if link already exists
    const existing = await this.prisma.groupCategoryLink.findUnique({
      where: {
        groupId_categoryId: {
          groupId: group.id,
          categoryId: body.categoryId,
        },
      },
    });

    if (existing) {
      return { message: 'Category already assigned to group', link: existing };
    }

    return this.prisma.groupCategoryLink.create({
      data: {
        groupId: group.id,
        categoryId: body.categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  @Delete(':externalId/categories/:categoryId')
  @ApiOperation({ summary: 'Remove a category from a group' })
  async remove(@Param('externalId') externalId: string, @Param('categoryId') categoryId: string) {
    const group = await this.prisma.articleGroupMirror.findUnique({ 
      where: { externalId },
      select: { id: true }
    });
    if (!group) throw new Error('Group not found');

    await this.prisma.groupCategoryLink.delete({
      where: {
        groupId_categoryId: {
          groupId: group.id,
          categoryId,
        },
      },
    });
    return { ok: true };
  }
}
