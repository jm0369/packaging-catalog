import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ListArticlesDto } from './dto/list-articles.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('articles')
@Controller('api/articles')
export class ArticlesController {
  constructor(private readonly svc: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'List articles (public, no prices/stocks)' })
  @ApiOkResponse({
    schema: {
      example: {
        total: 2,
        limit: 20,
        offset: 0,
        data: [
          {
            id: 'uuid',
            externalId: 'art-box-001',
            sku: 'BOX-300-200-150',
            ean: null,
            title: 'Standard Shipping Box 300x200x150',
            description: 'Single wall, brown',
            attributes: {
              wall: 'single',
              color: 'brown',
              dims_mm: [300, 200, 150],
            },
            uom: 'pcs',
            active: true,
            updatedAt: '2025-09-30T00:00:00.000Z',
            group: { id: 'uuid', externalId: 'grp-boxes', name: 'Boxes' },
          },
        ],
      },
    },
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async list(@Query() query: ListArticlesDto) {
    return this.svc.list(query);
  }
}
