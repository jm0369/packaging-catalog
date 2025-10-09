import { Controller, Get, Param, UseGuards, NotFoundException, Delete, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminGuard } from './admin.guard';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('admin:media-assets')
@ApiSecurity('admin')
@UseGuards(AdminGuard)
@Controller('admin/media-assets')
export class MediaAssetsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List all media assets with usage information' })
  async list() {
    const assets = await this.prisma.mediaAsset.findMany({
      include: {
        groupLinks: {
          include: {
            group: {
              select: {
                id: true,
                externalId: true,
                name: true,
              },
            },
          },
        },
        articleLinks: {
          include: {
            article: {
              select: {
                id: true,
                externalId: true,
                title: true,
              },
            },
          },
        },
        categoryLinks: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
        driveSync: {
          select: {
            driveFileId: true,
            driveFileName: true,
            lastSyncedAt: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    return assets.map((asset) => ({
      id: asset.id,
      key: asset.key,
      mime: asset.mime,
      width: asset.width,
      height: asset.height,
      sizeBytes: asset.sizeBytes,
      checksum: asset.checksum,
      variants: asset.variants,
      driveSync: asset.driveSync,
      usedInGroups: asset.groupLinks.map((link) => ({
        linkId: link.id,
        groupId: link.group.id,
        externalId: link.group.externalId,
        name: link.group.name,
        altText: link.altText,
        sortOrder: link.sortOrder,
      })),
      usedInArticles: asset.articleLinks.map((link) => ({
        linkId: link.id,
        articleId: link.article.id,
        externalId: link.article.externalId,
        title: link.article.title,
        altText: link.altText,
        sortOrder: link.sortOrder,
      })),
      usedInCategories: asset.categoryLinks.map((link) => ({
        linkId: link.id,
        categoryId: link.category.id,
        name: link.category.name,
        color: link.category.color,
        altText: link.altText,
        sortOrder: link.sortOrder,
      })),
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single media asset by ID with full usage details' })
  async getById(@Param('id') id: string) {
    const asset = await this.prisma.mediaAsset.findUnique({
      where: { id },
      include: {
        groupLinks: {
          include: {
            group: {
              select: {
                id: true,
                externalId: true,
                name: true,
                description: true,
              },
            },
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
        articleLinks: {
          include: {
            article: {
              select: {
                id: true,
                externalId: true,
                title: true,
                description: true,
              },
            },
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
        categoryLinks: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                type: true,
                color: true,
                description: true,
              },
            },
          },
          orderBy: {
            sortOrder: 'asc',
          },
        },
        driveSync: true,
      },
    });

    if (!asset) {
      throw new NotFoundException(`Media asset with ID ${id} not found`);
    }

    return {
      id: asset.id,
      key: asset.key,
      mime: asset.mime,
      width: asset.width,
      height: asset.height,
      sizeBytes: asset.sizeBytes,
      checksum: asset.checksum,
      variants: asset.variants,
      driveSync: asset.driveSync,
      usedInGroups: asset.groupLinks.map((link) => ({
        linkId: link.id,
        group: link.group,
        altText: link.altText,
        sortOrder: link.sortOrder,
      })),
      usedInArticles: asset.articleLinks.map((link) => ({
        linkId: link.id,
        article: link.article,
        altText: link.altText,
        sortOrder: link.sortOrder,
      })),
      usedInCategories: asset.categoryLinks.map((link) => ({
        linkId: link.id,
        category: link.category,
        altText: link.altText,
        sortOrder: link.sortOrder,
      })),
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a media asset (will fail if still in use)' })
  async delete(@Param('id') id: string) {
    // Check if asset exists
    const asset = await this.prisma.mediaAsset.findUnique({
      where: { id },
      include: {
        groupLinks: true,
        articleLinks: true,
        categoryLinks: true,
      },
    });

    if (!asset) {
      throw new NotFoundException(`Media asset with ID ${id} not found`);
    }

    // Check if asset is being used
    const usageCount = 
      asset.groupLinks.length + 
      asset.articleLinks.length + 
      asset.categoryLinks.length;

    if (usageCount > 0) {
      throw new BadRequestException(
        `Cannot delete media asset: it is used in ${usageCount} location(s). Remove all usages first.`
      );
    }

    await this.prisma.mediaAsset.delete({
      where: { id },
    });

    return { ok: true, message: 'Media asset deleted successfully' };
  }
}
