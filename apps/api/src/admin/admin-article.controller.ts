import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { AdminGuard } from './admin.guard';
import { UpdateArticleActiveDto } from './dto/update-article-active.dto';

@ApiTags('admin:articles')
@ApiSecurity('admin')
@UseGuards(AdminGuard)
@Controller('admin/articles')
export class AdminArticlesController {
  constructor(private prisma: PrismaService) {}

  @Patch(':externalId/active')
  @ApiOperation({ summary: 'Set article active status (by externalId)' })
  async setActive(
    @Param('externalId') externalId: string,
    @Body() dto: UpdateArticleActiveDto,
  ) {
    const updated = await this.prisma.articleMirror.update({
      where: { externalId },
      data: { active: dto.active },
      select: {
        id: true,
        externalId: true,
        active: true,
        title: true,
        updatedAt: true,
      },
    });
    return { data: updated };
  }
}