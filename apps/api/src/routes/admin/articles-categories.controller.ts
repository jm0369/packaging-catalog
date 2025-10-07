import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard } from './admin.guard';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('admin:articles-categories')
@ApiSecurity('admin')
@UseGuards(AdminGuard)
@Controller('admin/articles')
export class ArticlesCategoriesController {
  constructor(private prisma: PrismaService) {}

  @Get(':externalId/categories')
  @ApiOperation({ summary: 'List categories for an article' })
  async list(@Param('externalId') externalId: string) {
    const article = await this.prisma.articleMirror.findUnique({
      where: { externalId },
      select: {
        id: true,
        externalId: true,
        title: true,
        categories: {
          select: {
            id: true,
            category: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    });
    if (!article) return { article: null, categories: [] };

    const categories = article.categories.map((c) => ({
      linkId: c.id,
      ...c.category,
    }));
    return { 
      article: { id: article.id, externalId: article.externalId, title: article.title }, 
      categories 
    };
  }

  @Post(':externalId/categories')
  @ApiOperation({ summary: 'Assign a category to an article. Body: { categoryId }' })
  async assign(@Param('externalId') externalId: string, @Body() body: { categoryId: string }) {
    const article = await this.prisma.articleMirror.findUnique({ 
      where: { externalId },
      select: { id: true }
    });
    if (!article) throw new Error('Article not found');

    // Check if link already exists
    const existing = await this.prisma.articleCategoryLink.findUnique({
      where: {
        articleId_categoryId: {
          articleId: article.id,
          categoryId: body.categoryId,
        },
      },
    });

    if (existing) {
      return { message: 'Category already assigned to article', link: existing };
    }

    return this.prisma.articleCategoryLink.create({
      data: {
        articleId: article.id,
        categoryId: body.categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  @Delete(':externalId/categories/:categoryId')
  @ApiOperation({ summary: 'Remove a category from an article' })
  async remove(@Param('externalId') externalId: string, @Param('categoryId') categoryId: string) {
    const article = await this.prisma.articleMirror.findUnique({ 
      where: { externalId },
      select: { id: true }
    });
    if (!article) throw new Error('Article not found');

    await this.prisma.articleCategoryLink.delete({
      where: {
        articleId_categoryId: {
          articleId: article.id,
          categoryId,
        },
      },
    });
    return { ok: true };
  }
}
