import { Controller, Get, Param, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('public:groups')
@Controller('api/article-groups')
export class ArticleGroupsPublicController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List article groups (only those with articles)' })
  @ApiOkResponse({ description: '{ total, limit, offset, data }' })
  async list(
    @Query('limit') limitQ?: string, 
    @Query('offset') offsetQ?: string, 
    @Query('q') q?: string,
    @Query('category') categoryName?: string,
  ) {
    const limit = Math.min(100, Math.max(1, Number(limitQ ?? 24)));
    const offset = Math.max(0, Number(offsetQ ?? 0));

    // Look up category by name if provided
    let categoryId: string | undefined;
    if (categoryName) {
      const category = await this.prisma.category.findFirst({
        where: { 
          name: {
            equals: categoryName,
            mode: 'insensitive',
          }
        },
        select: { id: true },
      });
      categoryId = category?.id;
    }

    const where = {
      AND: [
        q ? { name: { contains: q, mode: 'insensitive' as const } } : {},
        // have articles
        { articles: { some: {} } },
        // filter by category if provided
        categoryId ? { categories: { some: { categoryId } } } : {},
      ],
    };

    const [items, total] = await Promise.all([
      this.prisma.articleGroupMirror.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        skip: offset, take: limit,
        select: {
          id: true, externalId: true, name: true, description: true,
          // primary image (lowest sortOrder)
          media: {
            orderBy: { sortOrder: 'asc' },
            select: { media: { select: { key: true } } },
          },
          // include categories
          categories: {
            select: {
              category: {
                select: { id: true, name: true, color: true },
              },
            },
          },
          // include articles for each group
          articles: {
            orderBy: { title: 'asc' },
            select: {
              id: true,
              externalId: true,
              title: true,
              sku: true,
              attributes: true,
              media: {
                orderBy: { sortOrder: 'asc' },
                select: { media: { select: { key: true } } },
              },
              categories: {
                select: {
                  category: {
                    select: { id: true, name: true, color: true, type: true },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.articleGroupMirror.count({ where }),
    ]);

    const base = process.env.PUBLIC_CDN_BASE!;
    const data = items.map((g) => ({
      id: g.id,
      externalId: g.externalId,
      name: g.name,
      description: g.description,
      media: g.media.map(m => `${base}/${m.media.key}`).filter(Boolean),
      categories: g.categories.map(c => c.category),
      articles: g.articles.map(a => ({
        id: a.id,
        externalId: a.externalId,
        title: a.title,
        sku: a.sku,
        attributes: a.attributes as Record<string, string> | null,
        media: a.media.map(m => `${base}/${m.media.key}`).filter(Boolean),
        categories: a.categories.map(c => c.category),
      })),
    }));
    return { total, limit, offset, data };
  }

  @Get(':externalId')
  @ApiOperation({ summary: 'Get a single group' })
  async byId(@Param('externalId') externalId: string) {
    const g = await this.prisma.articleGroupMirror.findUnique({
      where: { externalId },
      select: {
        id: true, externalId: true, name: true, description: true,
        media: { orderBy: { sortOrder: 'asc' }, select: { media: { select: { key: true } } } },
        // include categories
        categories: {
          select: {
            category: {
              select: { id: true, name: true, color: true },
            },
          },
        },
        // include articles for the group
        articles: {
          orderBy: { title: 'asc' },
          select: {
            id: true,
            externalId: true,
            title: true,
            sku: true,
            attributes: true,
            media: {
              orderBy: { sortOrder: 'asc' },
              select: { media: { select: { key: true } } },
            },
            categories: {
              select: {
                category: {
                  select: { id: true, name: true, color: true, type: true },
                },
              },
            },
          },
        },
      },
    });
    if (!g) return { statusCode: 404, message: 'Not found' };

    const base = process.env.PUBLIC_CDN_BASE!;
    return {
      id: g.id,
      externalId: g.externalId,
      name: g.name,
      description: g.description,
      media: g.media.map(m => `${base}/${m.media.key}`).filter(Boolean),
      categories: g.categories.map(c => c.category),
      articles: g.articles.map(a => ({
        id: a.id,
        externalId: a.externalId,
        title: a.title,
        sku: a.sku,
        attributes: a.attributes as Record<string, string> | null,
        media: a.media.map(m => `${base}/${m.media.key}`).filter(Boolean),
        categories: a.categories.map(c => c.category),
      })),
    };
  }
}