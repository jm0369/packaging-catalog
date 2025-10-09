import { Controller, Get, Param, UseGuards, NotFoundException, Delete, BadRequestException, Post, Body } from '@nestjs/common';
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

  @Post(':id/link-to-group')
  @ApiOperation({ summary: 'Link this media asset to a group. Body: { groupExternalId, altText?, sortOrder? }' })
  async linkToGroup(
    @Param('id') id: string,
    @Body() body: { groupExternalId: string; altText?: string | null; sortOrder?: number }
  ) {
    // Check if asset exists
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Media asset with ID ${id} not found`);
    }

    // Find the group
    const group = await this.prisma.articleGroupMirror.findUnique({
      where: { externalId: body.groupExternalId },
    });
    if (!group) {
      throw new NotFoundException(`Group with external ID ${body.groupExternalId} not found`);
    }

    // Check if link already exists
    const existingLink = await this.prisma.groupMediaLink.findFirst({
      where: {
        groupId: group.id,
        mediaId: id,
      },
    });

    if (existingLink) {
      throw new BadRequestException('This media asset is already linked to this group');
    }

    // Determine sort order
    let sortOrder = body.sortOrder ?? null;
    if (sortOrder === null) {
      const max = await this.prisma.groupMediaLink.aggregate({
        where: { groupId: group.id },
        _max: { sortOrder: true },
      });
      sortOrder = typeof max._max.sortOrder === 'number' ? max._max.sortOrder + 1 : 0;
    }

    // Create the link
    const link = await this.prisma.groupMediaLink.create({
      data: {
        groupId: group.id,
        mediaId: id,
        altText: body.altText ?? null,
        sortOrder,
      },
      include: {
        group: {
          select: {
            id: true,
            externalId: true,
            name: true,
          },
        },
      },
    });

    return {
      ok: true,
      link: {
        linkId: link.id,
        group: link.group,
        altText: link.altText,
        sortOrder: link.sortOrder,
      },
    };
  }

  @Post(':id/link-to-article')
  @ApiOperation({ summary: 'Link this media asset to an article. Body: { articleExternalId, altText?, sortOrder? }' })
  async linkToArticle(
    @Param('id') id: string,
    @Body() body: { articleExternalId: string; altText?: string | null; sortOrder?: number }
  ) {
    // Check if asset exists
    const asset = await this.prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Media asset with ID ${id} not found`);
    }

    // Find the article
    const article = await this.prisma.articleMirror.findUnique({
      where: { externalId: body.articleExternalId },
    });
    if (!article) {
      throw new NotFoundException(`Article with external ID ${body.articleExternalId} not found`);
    }

    // Check if link already exists
    const existingLink = await this.prisma.articleMediaLink.findFirst({
      where: {
        articleId: article.id,
        mediaId: id,
      },
    });

    if (existingLink) {
      throw new BadRequestException('This media asset is already linked to this article');
    }

    // Determine sort order
    let sortOrder = body.sortOrder ?? null;
    if (sortOrder === null) {
      const max = await this.prisma.articleMediaLink.aggregate({
        where: { articleId: article.id },
        _max: { sortOrder: true },
      });
      sortOrder = typeof max._max.sortOrder === 'number' ? max._max.sortOrder + 1 : 0;
    }

    // Create the link
    const link = await this.prisma.articleMediaLink.create({
      data: {
        articleId: article.id,
        mediaId: id,
        altText: body.altText ?? null,
        sortOrder,
      },
      include: {
        article: {
          select: {
            id: true,
            externalId: true,
            title: true,
          },
        },
      },
    });

    return {
      ok: true,
      link: {
        linkId: link.id,
        article: link.article,
        altText: link.altText,
        sortOrder: link.sortOrder,
      },
    };
  }

  @Delete(':id/unlink-from-group/:linkId')
  @ApiOperation({ summary: 'Remove link between this media asset and a group' })
  async unlinkFromGroup(
    @Param('id') id: string,
    @Param('linkId') linkId: string
  ) {
    // Check if link exists and belongs to this media asset
    const link = await this.prisma.groupMediaLink.findUnique({
      where: { id: linkId },
    });

    if (!link) {
      throw new NotFoundException(`Link with ID ${linkId} not found`);
    }

    if (link.mediaId !== id) {
      throw new BadRequestException('This link does not belong to this media asset');
    }

    await this.prisma.groupMediaLink.delete({
      where: { id: linkId },
    });

    return { ok: true, message: 'Link removed successfully' };
  }

  @Delete(':id/unlink-from-article/:linkId')
  @ApiOperation({ summary: 'Remove link between this media asset and an article' })
  async unlinkFromArticle(
    @Param('id') id: string,
    @Param('linkId') linkId: string
  ) {
    // Check if link exists and belongs to this media asset
    const link = await this.prisma.articleMediaLink.findUnique({
      where: { id: linkId },
    });

    if (!link) {
      throw new NotFoundException(`Link with ID ${linkId} not found`);
    }

    if (link.mediaId !== id) {
      throw new BadRequestException('This link does not belong to this media asset');
    }

    await this.prisma.articleMediaLink.delete({
      where: { id: linkId },
    });

    return { ok: true, message: 'Link removed successfully' };
  }
}
