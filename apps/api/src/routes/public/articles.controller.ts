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
  async list(
    @Query('limit') limitQ?: string,
    @Query('offset') offsetQ?: string,
    @Query('q') q?: string,
    @Query('group') groupExt?: string,
    @Query('category') categoryName?: string,
    @Query('length') lengthQ?: string,
    @Query('width') widthQ?: string,
    @Query('height') heightQ?: string,
  ) {
    const limit = Math.min(100, Math.max(1, Number(limitQ ?? 24)));
    const offset = Math.max(0, Number(offsetQ ?? 0));

    // Parse dimension filters
    const requestedLength = lengthQ ? Number(lengthQ) : null;
    const requestedWidth = widthQ ? Number(widthQ) : null;
    const requestedHeight = heightQ ? Number(heightQ) : null;
    const hasDimensionFilter = requestedLength !== null && requestedWidth !== null && requestedHeight !== null;

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

    // Fetch items without pagination if we need to do dimension filtering
    const itemsPromise = hasDimensionFilter
      ? this.prisma.articleMirror.findMany({
          where,
          select: {
            id: true, externalId: true, title: true, description: true, uom: true, ean: true, sku: true,
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
        })
      : this.prisma.articleMirror.findMany({
          where,
          orderBy: [{ title: 'asc' }],
          skip: offset,
          take: limit,
          select: {
            id: true, externalId: true, title: true, description: true, uom: true, ean: true, sku: true,
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
        });

    const [items, totalBeforeFilter] = await Promise.all([
      itemsPromise,
      this.prisma.articleMirror.count({ where }),
    ]);

    // Apply dimension filtering and sorting if requested
    let filteredItems = items;
    if (hasDimensionFilter) {
      const requestedDims = [requestedLength!, requestedWidth!, requestedHeight!];
      const requestedVolume = requestedLength! * requestedWidth! * requestedHeight!;

      // Helper function to check if requested dimensions fit in article dimensions
      const calculateFit = (articleDims: number[]): number | null => {
        // Try all 6 permutations of requested dimensions
        const permutations = [
          [requestedDims[0], requestedDims[1], requestedDims[2]],
          [requestedDims[0], requestedDims[2], requestedDims[1]],
          [requestedDims[1], requestedDims[0], requestedDims[2]],
          [requestedDims[1], requestedDims[2], requestedDims[0]],
          [requestedDims[2], requestedDims[0], requestedDims[1]],
          [requestedDims[2], requestedDims[1], requestedDims[0]],
        ];

        for (const perm of permutations) {
          if (perm[0] <= articleDims[0] && perm[1] <= articleDims[1] && perm[2] <= articleDims[2]) {
            // Calculate empty volume (wasted space)
            const articleVolume = articleDims[0] * articleDims[1] * articleDims[2];
            return articleVolume - requestedVolume;
          }
        }
        return null; // Doesn't fit
      };

      // Filter and score articles
      const scoredItems = items
        .map((item) => {
          const attrs = item.attributes as any;
          if (!attrs?._INNENLAENGE || !attrs?._INNENBREITE || !attrs?._INNENHOEHE) {
            return null;
          }

          const articleDims = [
            Number(attrs._INNENLAENGE),
            Number(attrs._INNENBREITE),
            Number(attrs._INNENHOEHE),
          ];

          // Check if all dimensions are valid numbers
          if (articleDims.some(d => isNaN(d) || d <= 0)) {
            return null;
          }

          const emptyVolume = calculateFit(articleDims);
          if (emptyVolume === null) {
            return null; // Doesn't fit
          }

          return { item, emptyVolume };
        })
        .filter((x): x is { item: typeof items[0]; emptyVolume: number } => x !== null)
        .sort((a, b) => a.emptyVolume - b.emptyVolume); // Sort by best fit (least empty volume)

      filteredItems = scoredItems.map(x => x.item);
      
      // Apply pagination after filtering
      const total = filteredItems.length;
      filteredItems = filteredItems.slice(offset, offset + limit);

      const base = process.env.PUBLIC_CDN_BASE!;
      const data = filteredItems.map((a) => ({
        id: a.id,
        externalId: a.externalId,
        title: a.title,
        description: a.description,
        uom: a.uom,
        ean: a.ean,
        sku: a.sku,
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

    // Default case: no dimension filter
    const base = process.env.PUBLIC_CDN_BASE!;
    const data = filteredItems.map((a) => ({
      id: a.id,
      externalId: a.externalId,
      title: a.title,
      description: a.description,
      uom: a.uom,
      ean: a.ean,
      sku: a.sku,
      attributes: a.attributes,
      articleGroup: a.articleGroup ? {
        externalId: a.articleGroup.externalId,
        name: a.articleGroup.name,
      } : null,
      categories: a.categories.map(c => c.category),
      media: a.media.map(m => `${base}/${m.media.key}`).filter(Boolean),
    }));

    return { total: totalBeforeFilter, limit, offset, data };
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
      } : null,
      categories: a.categories.map(c => c.category),
      media: a.media.map(m => `${base}/${m.media.key}`).filter(Boolean),
    };
  }
}