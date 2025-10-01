// apps/api/src/routes/articles/articles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
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
          group: { select: { externalId: true } }, // <-- get group externalId too
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
      articleGroupExternalId: a.group?.externalId ?? null, // ✅ add for convenience
    }));

    return { total, limit, offset, data };
  }

  /**
   * List by group externalId ("Number" from SelectLine).
   * Returns articleGroupId (UUID) and articleGroupExternalId for every item.
   */
  async listByGroupExternalId(params: {
    externalId: string; // group externalId (SelectLine "Number")
    limit?: number;
    offset?: number;
    q?: string;
  }) {
    const { externalId, limit = 20, offset = 0, q } = params;

    const group = await this.prisma.articleGroupMirror.findUnique({
      where: { externalId },
      select: { id: true, externalId: true },
    });

    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const where: Prisma.ArticleMirrorWhereInput = {
      AND: [
        { articleGroupId: group.id },
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
          articleGroupId: true, // <-- UUID
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
      articleGroupId: a.articleGroupId, // ✅ required by your frontend
      articleGroupExternalId: group.externalId, // ✅ helpful too
    }));

    return { total, limit, offset, data };
  }

  async getOneByExternalId(externalId: string) {
    const a = await this.prisma.articleMirror.findFirst({
      where: { OR: [{ externalId }, { sku: externalId }] },
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
        group: { select: { externalId: true, name: true } },
        attributes: true,
      },
    });
    if (!a) return null;

    return {
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
      articleGroupExternalId: a.group?.externalId ?? null,
      articleGroupName: a.group?.name ?? null,
      attributes: a.attributes ?? null,
    };
  }

  async getByExternalId(externalId: string) {
    const article = await this.prisma.articleMirror.findUnique({
      where: { externalId },
      include: {
        group: {
          select: { id: true, externalId: true, name: true },
        },
      },
    });

    if (!article) {
      throw new NotFoundException(`Article ${externalId} not found`);
    }

    return {
      id: article.id,
      externalId: article.externalId,
      sku: article.sku,
      ean: article.ean,
      title: article.title,
      description: article.description,
      uom: article.uom,
      active: article.active,
      updatedAt: article.updatedAt.toISOString(),
      group: article.group,
    };
  }
}
