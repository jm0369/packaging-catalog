import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleGroupsService } from './article-groups.service';
import { ListArticleGroupsDto } from './dto/list-article-groups.dto';
import { ListGroupArticlesDto } from './dto/list-group-articles.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('article-groups')
@Controller('api/article-groups')
export class ArticleGroupsController {
  constructor(private readonly svc: ArticleGroupsService) {}

  @Get()
  @ApiOperation({ summary: 'List article groups' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async list(@Query() query: ListArticleGroupsDto) {
    return this.svc.list(query);
  }

  @Get(':externalId')
  @ApiOperation({ summary: 'Get a single article group by externalId' })
  async byExternalId(@Param('externalId') externalId: string) {
    return this.svc.byExternalId(externalId);
  }

  @Get(':externalId/articles')
  @ApiOperation({ summary: 'List articles belonging to a group' })
  @ApiOkResponse({
    schema: {
      example: {
        group: { id: 'uuid', externalId: 'grp-boxes', name: 'Boxes' },
        total: 1,
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
  async articlesForGroup(
    @Param('externalId') externalId: string,
    @Query() query: ListGroupArticlesDto,
  ) {
    return this.svc.articlesForGroup(externalId, query);
  }
}
