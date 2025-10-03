import {
  Controller,
  Get,
  Query,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ListArticlesDto } from './dto/list-articles.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma/prisma.service';
import { getEnv } from 'src/config/env';

@ApiTags('articles')
@Controller('api/articles')
export class ArticlesController {
  constructor(
    private readonly svc: ArticlesService,
    private prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List articles (public, no prices/stocks)' })
  @ApiOkResponse({
    /* ... keep your example schema */
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async list(@Query() query: ListArticlesDto) {
    return this.svc.list(query);
  }

  @Get(':externalId')
  @ApiOperation({
    summary: 'Get one article (enriched via SelectLine macro on-demand)',
  })
  @ApiOkResponse({
    schema: {
      example: {
        id: 'uuid',
        externalId: '100002',
        sku: '100002',
        ean: '4255865903638',
        title: 'PC P B02.01',
        description: null,
        uom: 'Stück',
        active: true,
        updatedAt: '2025-09-22T11:59:19.800Z',
        group: { id: 'uuid', externalId: 'PC P B02', name: 'PC P B02 …' },
        attributes: {
          enrichedAt: '2025-10-01T15:02:11.123Z',
          enriched: {
            ART_ID: 2780,
            Artikelnummer: '100002',
            EANNummer: '4255865903638',
            // ... all macro columns mapped
            _AUSSENLAENGE: 198.0,
            _AUSSENBREITE: 135.0,
            _AUSSENHOEHE: 63.0,
            // etc.
          },
        },
      },
    },
  })
  async getOne(@Param('externalId') externalId: string) {
    const data = await this.svc.getOne(externalId);
    if (!data) return { message: 'Not found' }; // or throw NotFoundException
    return data;
  }

  @Get(':externalId/media')
  async media(@Param('externalId') externalId: string) {
    const { PUBLIC_CDN_BASE: cdn } = getEnv();
    const article = await this.prisma.articleMirror.findUnique({
      where: { externalId },
      select: { id: true },
    });
    if (!article) return { total: 0, data: [] };

    const links = await this.prisma.articleMediaLink.findMany({
      where: { articleId: article.id },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
      select: {
        id: true,
        altText: true,
        sortOrder: true,
        media: { select: { key: true, mime: true } },
      },
    });

    const data = links
      .map((l, i) => ({
        id: l.id,
        url: l.media?.key ? `${cdn}/${l.media.key}` : null,
        altText: l.altText ?? null,
        sortOrder: l.sortOrder,
        isPrimary: l.sortOrder === 0 || i === 0,
        mime: l.media?.mime ?? null,
      }))
      .filter((x) => !!x.url);

    return { total: data.length, data };
  }
}
