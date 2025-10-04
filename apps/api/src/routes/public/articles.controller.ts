import { Controller, Get, Param, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('public:articles')
@Controller('api/articles')
export class ArticlesPublicController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List articles' })
  @ApiOkResponse({ description: '{ total, limit, offset, data }' })
  async list(@Query('limit') limitQ?: string, @Query('offset') offsetQ?: string, @Query('q') q?: string, @Query('group') groupExt?: string) {
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
      ],
    };

    const [items, total] = await Promise.all([
      this.prisma.articleMirror.findMany({
        where,
        orderBy: [{ title: 'asc' }],
        skip: offset,
        take: limit,
        select: {
          id: true, externalId: true, title: true, description: true, uom: true, ean: true,
          articleGroup: { select: { externalId: true, name: true } },
          // primary image (lowest sortOrder)
          media: {
            orderBy: { sortOrder: 'asc' },
            take: 1,
            select: { media: { select: { key: true } } },
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
      articleGroup: a.articleGroup ? {
        externalId: a.articleGroup.externalId,
        name: a.articleGroup.name,
      } : null,
      imageUrl: a.media[0]?.media?.key ? `${base}/${a.media[0].media.key}` : null,
    }));

    return { total, limit, offset, data };
  }

  @Get(':externalId')
  @ApiOperation({ summary: 'Get single article' })
  async byId(@Param('externalId') externalId: string) {
    const a = await this.prisma.articleMirror.findUnique({
      where: { externalId },
      select: {
        id: true, externalId: true, sku: true, ean: true, title: true, description: true, uom: true, updatedAt: true,
        articleGroup: { select: { id: true, externalId: true, name: true } },
        media: { orderBy: { sortOrder: 'asc' }, select: { media: { select: { key: true } } } },
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
      } : null,
      media: a.media.map(m => `${base}/${m.media.key}`).filter(Boolean),
    };
  }
}