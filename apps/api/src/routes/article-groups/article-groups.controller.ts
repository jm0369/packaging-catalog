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
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ArticlesService } from '../articles/articles.service';

@ApiTags('article-groups')
@Controller('api/article-groups')
export class ArticleGroupsController {
  constructor(
    private readonly svc: ArticleGroupsService,
    private articles: ArticlesService,
  ) {}

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
  @ApiOperation({ summary: 'List articles in a group by group externalId' })
  @ApiParam({ name: 'externalId', required: true })
  @ApiQuery({
    name: 'limit',
    required: false,
    schema: { type: 'integer', default: 20, minimum: 1, maximum: 100 },
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    schema: { type: 'integer', default: 0, minimum: 0 },
  })
  @ApiQuery({ name: 'q', required: false, schema: { type: 'string' } })
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async listGroupArticles(
    @Param('externalId') externalId: string,
    @Query() query: ListGroupArticlesDto,
  ) {
    const { limit, offset, q } = query;
    return this.articles.listByGroupExternalId({
      externalId,
      limit,
      offset,
      q,
    });
  }
}
