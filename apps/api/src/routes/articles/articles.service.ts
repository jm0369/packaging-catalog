// apps/api/src/routes/articles/articles.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Prisma } from '@prisma/client';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async list(params: {
    limit?: number;
    offset?: number;
    q?: string;
    groupId?: string;
  }) {
    const { limit = 20, offset = 0, q, groupId } = params;

    const where: Prisma.ArticleMirrorWhereInput = {
      AND: [
        groupId ? { articleGroupId: groupId } : {},
        q
          ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { sku: { contains: q, mode: 'insensitive' } },
                { ean: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {},
      ],
    };

    const [items, total] = await Promise.all([
      this.prisma.articleMirror.findMany({
        where,
        orderBy: [{ title: 'asc' }],
        skip: offset,
        take: limit,
        select: {
          id: true,
          externalId: true,
          sku: true,
          ean: true,
          title: true,
          description: true,
          uom: true,
          active: true,
          updatedAt: true,
          articleGroupId: true,
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
      uom: a.uom,
      active: a.active,
      updatedAt: a.updatedAt.toISOString(),
      articleGroupId: a.articleGroupId,
    }));

    return { total, limit, offset, data };
  }
}
