// apps/api/src/sync/sync.debug.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { SelectLineClient } from './selectline.client';

@Controller('admin/sl')
export class SyncDebugController {
  constructor(private sl: SelectLineClient) {}

  @Get('groups')
  async groups(@Query('page') page = '1', @Query('pageSize') pageSize = '10') {
    return this.sl.listArticleGroups({
      page: Number(page),
      pageSize: Number(pageSize),
    });
  }

  @Get('articles')
  async articles(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
    @Query('since') since?: string,
    @Query('groupId') groupId?: string,
  ) {
    return this.sl.listArticles({
      page: Number(page),
      pageSize: Number(pageSize),
      updatedSince: since,
      groupId,
    });
  }
}
