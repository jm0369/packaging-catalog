import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard } from './admin.guard';
import { ApiOkResponse, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('admin:articles')
@ApiSecurity('admin')
@UseGuards(AdminGuard)
@Controller('admin/articles')
export class ArticlesAdminController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List all articles (including hidden)' })
  @ApiOkResponse({ description: '{ total, limit, offset, data }' })
  async list(
    @Query('limit') limitQ?: string,
    @Query('offset') offsetQ?: string,
    @Query('q') q?: string,
    @Query('group') groupExt?: string,
    @Query('category') categoryName?: string,
  ) {
    const limit = Math.min(100, Math.max(1, Number(limitQ ?? 24)));
    const offset = Math.max(0, Number(offsetQ ?? 0));

    const where = {
      AND: [
        q ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' as const } },
            { description: { contains: q, mode: 'insensitive' as const } },
            { sku: { contains: q, mode: 'insensitive' as const } },
            { ean: { contains: q, mode: 'insensitive' as const } },
          ],
        } : {},
        groupExt ? { articleGroup: { externalId: groupExt } } : {},
        categoryName ? { categories: { some: { category: { name: categoryName } } } } : {},
      ],
    };

    const [items, total] = await Promise.all([
      this.prisma.articleMirror.findMany({
        where,
        orderBy: [{ title: 'asc' }],
        skip: offset,
        take: limit,
        select: {
          id: true, externalId: true, title: true, description: true, uom: true, ean: true, sku: true, isVisible: true,
          articleGroup: { select: { externalId: true, name: true } },
          media: {
            orderBy: { sortOrder: 'asc' },
            select: { media: { select: { key: true } } },
          },
          categories: {
            select: {
              category: {
                select: { id: true, name: true, type: true, color: true }
              }
            }
          },
          attributes: true,
        },
      }),
      this.prisma.articleMirror.count({ where }),
    ]);

    const base = process.env.PUBLIC_CDN_BASE!;
    const data = items.map((a) => ({
      id: a.id,
      externalId: a.externalId,
      title: a.title,
      description: a.description,
      uom: a.uom,
      ean: a.ean,
      sku: a.sku,
      isVisible: a.isVisible,
      attributes: a.attributes,
      articleGroup: a.articleGroup ? {
        externalId: a.articleGroup.externalId,
        name: a.articleGroup.name,
      } : null,
      categories: a.categories.map(c => c.category),
      media: a.media.map(m => `${base}/${m.media.key}`).filter(Boolean),
    }));

    return { total, limit, offset, data };
  }

  @Get(':externalId')
  @ApiOperation({ summary: 'Get single article (including hidden)' })
  async byId(@Param('externalId') externalId: string) {
    const a = await this.prisma.articleMirror.findUnique({
      where: { externalId },
      select: {
        id: true, externalId: true, sku: true, ean: true, title: true, description: true, uom: true, updatedAt: true, isVisible: true,
        articleGroup: { 
          select: { 
            id: true, 
            externalId: true, 
            name: true,
            categories: {
              select: {
                category: {
                  select: { id: true, name: true, type: true, color: true }
                }
              }
            }
          } 
        },
        media: { orderBy: { sortOrder: 'asc' }, select: { media: { select: { key: true } } } },
        categories: {
          select: {
            category: {
              select: { id: true, name: true, type: true, color: true }
            }
          }
        },
        attributes: true
      },
    });
    if (!a) return { statusCode: 404, message: 'Not found' };

    const base = process.env.PUBLIC_CDN_BASE!;
    return {
      ...a,
      group: a.articleGroup ? {
        id: a.articleGroup.id,
        externalId: a.articleGroup.externalId,
        name: a.articleGroup.name,
        categories: a.articleGroup.categories.map(c => c.category),
      } : null,
      categories: a.categories.map(c => c.category),
      media: a.media.map(m => `${base}/${m.media.key}`).filter(Boolean),
    };
  }
}
