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
  async list(@Query('limit') limitQ?: string, @Query('offset') offsetQ?: string, @Query('q') q?: string) {
    const limit = Math.min(100, Math.max(1, Number(limitQ ?? 24)));
    const offset = Math.max(0, Number(offsetQ ?? 0));

    const where = {
      AND: [
        q ? { name: { contains: q, mode: 'insensitive' as const } } : {},
        // have articles
        { articles: { some: {} } },
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
            take: 1,
            select: { media: { select: { key: true } } },
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
      imageUrl: g.media[0]?.media?.key ? `${base}/${g.media[0].media.key}` : null,
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
    };
  }

  @Get(':externalId/articles')
  @ApiOperation({ summary: 'List articles in a group' })
  async groupArticles(
    @Param('externalId') externalId: string,
    @Query('limit') limitQ?: string,
    @Query('offset') offsetQ?: string,
    @Query('q') q?: string,
  ) {
    const group = await this.prisma.articleGroupMirror.findUnique({
      where: { externalId },
      select: { id: true },
    });
    if (!group) return { total: 0, limit: 0, offset: 0, data: [] };

    const limit = Math.min(100, Math.max(1, Number(limitQ ?? 24)));
    const offset = Math.max(0, Number(offsetQ ?? 0));

    const where = {
      AND: [
        { articleGroupId: group.id },
        q ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' as const } },
            { description: { contains: q, mode: 'insensitive' as const } },
            { sku: { contains: q, mode: 'insensitive' as const } },
            { ean: { contains: q, mode: 'insensitive' as const } },
          ],
        } : {},
      ],
    };

    const [items, total] = await Promise.all([
      this.prisma.articleMirror.findMany({
        where, skip: offset, take: limit, orderBy: [{ title: 'asc' }],
        select: {
          id: true, externalId: true, title: true, description: true, uom: true, ean: true,
        },
      }),
      this.prisma.articleMirror.count({ where }),
    ]);

    return { total, limit, offset, data: items };
  }
}