// apps/api/src/routes/article-groups/article-groups.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client'; // ✅ import Prisma types

const cdn = process.env.PUBLIC_CDN_BASE ?? '';

@Injectable()
export class ArticleGroupsService {
  constructor(private prisma: PrismaService) {}

  async list(params: { limit?: number; offset?: number; q?: string }) {
    const { limit = 20, offset = 0, q } = params;

    // ✅ Strongly type the where input and use Prisma.QueryMode.insensitive
    const where: Prisma.ArticleGroupMirrorWhereInput = q
      ? {
          OR: [
            { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
            {
              description: { contains: q, mode: Prisma.QueryMode.insensitive },
            },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.prisma.articleGroupMirror.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        skip: offset,
        take: limit,
        include: {
          mediaLinks: {
            take: 1,
            orderBy: { sortOrder: 'asc' },
            include: { media: true },
          },
        },
      }),
      this.prisma.articleGroupMirror.count({ where }),
    ]);

    const data = items.map((g) => ({
      id: g.id,
      externalId: g.externalId,
      name: g.name,
      description: g.description,
      imageUrl: g.mediaLinks[0]?.media?.key
        ? `${cdn}/${g.mediaLinks[0].media.key}`
        : null,
    }));

    return { total, limit, offset, data };
  }

  async byExternalId(externalId: string) {
    const group = await this.prisma.articleGroupMirror.findUnique({
      where: { externalId },
      include: {
        mediaLinks: {
          take: 1,
          orderBy: { sortOrder: 'asc' },
          include: { media: true },
        },
      },
    });

    if (!group) throw new NotFoundException('Article group not found');

    return {
      id: group.id,
      externalId: group.externalId,
      name: group.name,
      description: group.description,
      imageUrl: group.mediaLinks[0]?.media?.key
        ? `${cdn}/${group.mediaLinks[0].media.key}`
        : null,
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
