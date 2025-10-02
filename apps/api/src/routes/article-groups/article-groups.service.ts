// apps/api/src/routes/article-groups/article-groups.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client'; // ✅ import Prisma types
import { cdnUrlForKey } from 'src/utils/cdn';

function mapImages(links: { sortOrder: number; media: { key: string } }[]) {
  // Sort by sortOrder ASC, then map to URLs
  const sorted = [...links].sort((a, b) => a.sortOrder - b.sortOrder);
  const urls = sorted.map((l) => cdnUrlForKey(l.media.key));
  const primary = urls[0] ?? null;
  return { primary, urls };
}

@Injectable()
export class ArticleGroupsService {
  constructor(private prisma: PrismaService) {}

  async list(params: { limit?: number; offset?: number; q?: string }) {
    const { limit = 24, offset = 0, q } = params;

    const where: Prisma.ArticleGroupMirrorWhereInput = q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {};

    const [rows, total] = await Promise.all([
      this.prisma.articleGroupMirror.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        include: {
          mediaLinks: {
            select: { sortOrder: true, media: { select: { key: true } } },
          },
        },
      }),
      this.prisma.articleGroupMirror.count({ where }),
    ]);

    const data = rows.map((g) => {
      const { primary, urls } = mapImages(g.mediaLinks);
      return {
        id: g.id,
        externalId: g.externalId,
        name: g.name,
        description: g.description,
        imageUrl: primary, // backward compatible
        images: urls, // NEW: all images
      };
    });

    return { total, limit, offset, data };
  }

  async byExternalId(externalId: string) {
    const g = await this.prisma.articleGroupMirror.findUnique({
      where: { externalId },
      include: {
        mediaLinks: {
          select: { sortOrder: true, media: { select: { key: true } } },
        },
      },
    });
    if (!g) return null;

    const { primary, urls } = mapImages(g.mediaLinks);
    return {
      id: g.id,
      externalId: g.externalId,
      name: g.name,
      description: g.description,
      imageUrl: primary, // primary
      images: urls, // all
    };
  }

  async articlesForGroup(
    externalId: string,
    params: { limit?: number; offset?: number; q?: string },
  ) {
    const { limit = 20, offset = 0, q } = params;

    const group = await this.prisma.articleGroupMirror.findUnique({
      where: { externalId },
    });
    if (!group) throw new NotFoundException('Article group not found');

    const where: Prisma.ArticleMirrorWhereInput = {
      active: true,
      articleGroupId: group.id,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: Prisma.QueryMode.insensitive } },
              {
                description: {
                  contains: q,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              { sku: { contains: q, mode: Prisma.QueryMode.insensitive } },
              { ean: { contains: q, mode: Prisma.QueryMode.insensitive } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.articleMirror.findMany({
        where,
        orderBy: [{ title: 'asc' }],
        skip: offset,
        take: limit,
        include: {
          group: { select: { id: true, externalId: true, name: true } },
        },
      }),
      this.prisma.articleMirror.count({ where }),
    ]);

    const data = items.map((a) => ({
      id: a.id,
      externalId: a.externalId,
      sku: a.sku,
      ean: a.ean,
      title: a.title,
      description: a.description,
      attributes: a.attributes,
      uom: a.uom,
      active: a.active,
      updatedAt: a.updatedAt,
      group: a.group
        ? { id: a.group.id, externalId: a.group.externalId, name: a.group.name }
        : null,
    }));

    return {
      group: { id: group.id, externalId: group.externalId, name: group.name },
      total,
      limit,
      offset,
      data,
    };
  }
}
