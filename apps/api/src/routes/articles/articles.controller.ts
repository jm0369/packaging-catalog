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
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('articles')
@Controller('api/articles')
export class ArticlesController {
  constructor(private readonly svc: ArticlesService) {}

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
  @ApiOperation({ summary: 'Get one article by externalId' })
  @ApiParam({ name: 'externalId', type: String })
  @ApiOkResponse({
    schema: {
      example: {
        id: 'uuid',
        externalId: 'art-box-001',
        sku: 'BOX-300-200-150',
        ean: null,
        title: 'Standard Shipping Box 300x200x150',
        description: 'Single wall, brown',
        uom: 'pcs',
        active: true,
        updatedAt: '2025-09-30T00:00:00.000Z',
        group: { id: 'uuid', externalId: 'grp-boxes', name: 'Boxes' },
      },
    },
  })
  async getOne(@Param('externalId') externalId: string) {
    return this.svc.getByExternalId(externalId);
  }
}
