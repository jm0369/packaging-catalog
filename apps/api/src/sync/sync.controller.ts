import { Controller, Post } from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('admin/sync')
export class SyncController {
  constructor(private sync: SyncService) {}

  @Post('groups')
  groups() {
    return this.sync.syncArticleGroups();
  }

  @Post('articles')
  articles() {
    return this.sync.syncArticles();
  }
}
