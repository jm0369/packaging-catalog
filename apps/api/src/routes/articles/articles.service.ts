// apps/api/src/routes/articles/articles.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Prisma } from '@prisma/client';
import { SelectLineClient } from 'src/sync/selectline.client';
import { mergeEnriched } from 'src/sync/enrich.util';

interface EnrichedAttributes {
  enriched?: boolean;
  enrichedAt?: string;
  [key: string]: any;
}

const withCdn = (key?: string | null, cdn?: string | null) =>
  key ? `${(cdn ?? '').replace(/\/$/, '')}/${key}` : null;

@Injectable()
export class ArticlesService {
  constructor(
    private prisma: PrismaService,
    private sl: SelectLineClient,
  ) {}

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
    const cdn = process.env.PUBLIC_CDN_BASE ?? null;

    const a = await this.prisma.articleMirror.findUnique({
      where: { externalId },
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
        group: { select: { id: true, externalId: true, name: true } },
      },
    });
    if (!a) return null;

    // fetch all article images (sorted)
    const links = await this.prisma.articleMediaLink.findMany({
      where: { articleId: a.id },
      include: { media: true },
      orderBy: { sortOrder: 'asc' },
    });

    const images = links.map((l) => ({
      id: l.id,
      mediaId: l.mediaId,
      altText: l.altText,
      sortOrder: l.sortOrder,
      url: withCdn(l.media?.key, cdn),
      width: l.media?.width ?? null,
      height: l.media?.height ?? null,
      mime: l.media?.mime ?? null,
    }));

    const primaryUrl = images[0]?.url ?? null;

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
      imageUrl: primaryUrl, // for backwards compat
      images, // ✅ new field
      group: a.group
        ? { id: a.group.id, externalId: a.group.externalId, name: a.group.name }
        : null,
    };
  }

  async getOne(externalId: string) {
    const cdn = process.env.PUBLIC_CDN_BASE ?? null;

    let art = await this.prisma.articleMirror.findUnique({
      where: { externalId },
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
        group: { select: { id: true, externalId: true, name: true } },
        attributes: true,
      },
    });

    if (!art) return null;

    // fetch all article images (sorted)
    const links = await this.prisma.articleMediaLink.findMany({
      where: { articleId: art.id },
      include: { media: true },
      orderBy: { sortOrder: 'asc' },
    });

    const images = links.map((l) => ({
      id: l.id,
      mediaId: l.mediaId,
      altText: l.altText,
      sortOrder: l.sortOrder,
      url: withCdn(l.media?.key, cdn),
      width: l.media?.width ?? null,
      height: l.media?.height ?? null,
      mime: l.media?.mime ?? null,
    }));

    const primaryUrl = images[0]?.url ?? null;

    // Decide if we need enrichment:
    const attributes = art.attributes as EnrichedAttributes | null;
    const alreadyEnriched = !!attributes?.enriched;
    // Optional: refresh after X days
    const STALE_MS = 7 * 24 * 3600 * 1000;
    const enrichedAt = attributes?.enrichedAt;
    const isStale = enrichedAt
      ? Date.now() - Date.parse(enrichedAt) > STALE_MS
      : !alreadyEnriched;

    if (isStale && art.sku) {
      try {
        console.log(
          `[ArticlesService] Enriching article ${externalId} via SelectLine macro`,
        );
        const details = await this.sl.getArticleDetailsByNumber(art.sku);
        if (details) {
          // persist enrichment
          const updated = await this.prisma.articleMirror.update({
            where: { externalId },
            data: {
              attributes: mergeEnriched(art.attributes ?? {}, details),
            },
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
              group: { select: { id: true, externalId: true, name: true } },
              attributes: true,
            },
          });
          art = updated;
        }
      } catch (e) {
        // Non-fatal: log; still return the non-enriched result

        console.warn('[ArticlesService] Enrich failed:', (e as Error)?.message);
      }
    }

    return {
      id: art.id,
      externalId: art.externalId,
      sku: art.sku,
      ean: art.ean,
      title: art.title,
      description: art.description,
      uom: art.uom,
      active: art.active,
      updatedAt: art.updatedAt.toISOString(),
      imageUrl: primaryUrl, // for backwards compat
      images, // ✅ new field
      group: art.group,
      // expose enriched block under attributes.enriched
      attributes: art.attributes ?? null,
    };
  }
}
