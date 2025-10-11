import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SelectLineClient } from '../selectline/selectline.client';
import type { SlArticle, SlArticleGroup } from '../selectline/selectline.types';

/**
 * Pulls from SelectLine and mirrors into our DB.
 * Rule: only keep groups that have at least one article (SelectLine only returns active articles).
 */
@Injectable()
export class SyncService {
  private readonly log = new Logger(SyncService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly sl: SelectLineClient,
  ) {}

  async syncAll() {
    if (!this.sl) throw new Error('SelectLineClient not injected');

    // 1) Fetch articles paged and bucket by groupExternalId
    const articles: SlArticle[] = [];
    const PAGE = 50;
    for (let page = 0; page < 10000; page++) {
      const batch = await this.sl.fetchArticles(page, PAGE);
      articles.push(...batch);
      if (batch.length < PAGE) break;
    }

    var groupsNeeded = new Set(
      articles
        .map((a) => a.groupExternalId)
        .filter((id) => id && id !== '') // Remove null/empty group IDs
    );

    // 2) Fetch groups and filter to ones that have articles
    const groups: SlArticleGroup[] = [];
    for (let page = 0; page < 10000; page++) {
      const gs = await this.sl.fetchGroups(page, PAGE);
      groups.push(...gs);
      if (gs.length < PAGE) break;
    }
    const filteredGroups = groups.filter((g) => groupsNeeded.has(g.id));

    // 3) Upsert groups
    for (const g of filteredGroups) {
      await this.prisma.articleGroupMirror.upsert({
        where: { externalId: g.id },
        create: {
          externalId: g.id,
          name: g.name,
          description: g.description,
          parentExternalId: g.parentId,
          sortOrder: g.sortOrder,
        },
        update: {
          parentExternalId: g.parentId,
          sortOrder: g.sortOrder,
        },
      });
    }

    // 4) Upsert articles, attach macro attributes
    for (const a of articles) {
      const macro = await this.sl.fetchArticleMacro(a.externalId).catch(() => null);
      // ✅ Coerce to JsonValue via JSON roundtrip, else JsonNull
      const jsonAttrs =
        macro
          ? (JSON.parse(JSON.stringify(macro)) as Prisma.InputJsonValue)
          : Prisma.JsonNull; // ← acceptable for the field's union

      if (!a.groupExternalId) continue; // group not mirrored (skip)

      const group = await this.prisma.articleGroupMirror.findUnique({
        where: { externalId: a.groupExternalId },
        select: { id: true },
      });
      if (!group) continue; // group not mirrored (skip)

      await this.prisma.articleMirror.upsert({
        where: { externalId: a.externalId },
        create: {
          externalId: a.externalId,
          articleGroupId: group.id,
          sku: a.sku,
          ean: a.ean,
          title: a.title,
          description: a.description,
          uom: a.uom,
          updatedAt: a.updatedAt ? new Date(a.updatedAt) : new Date(0),
          attributes: jsonAttrs,
        },
        update: {
          articleGroupId: group.id,
          sku: a.sku,
          ean: a.ean,
          title: a.title,
          description: a.description,
          uom: a.uom,
          updatedAt: a.updatedAt ? new Date(a.updatedAt) : new Date(0),
          attributes: jsonAttrs,
        },
      });
    }

    // 5) Optionally, clean up groups that no longer have articles
    await this.prisma.articleGroupMirror.deleteMany({
      where: {
        externalId: { notIn: Array.from(groupsNeeded) },
      },
    });

    this.log.log(`Sync done: groups=${filteredGroups.length} articles=${articles.length}`);
    return { groups: filteredGroups.length, articles: articles.length };
  }
}
