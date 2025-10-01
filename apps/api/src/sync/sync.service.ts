import { Prisma } from '@prisma/client';
// apps/api/src/sync/sync.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SelectLineClient } from './selectline.client';
import type { SlArticleGroup, SlArticle } from './selectline.types';
import { errorMessage } from '../utils/error';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  constructor(
    private prisma: PrismaService,
    private sl: SelectLineClient,
  ) {}

  // ---- Groups first ----
  async syncArticleGroups() {
    const started = Date.now();
    const items: SlArticleGroup[] =
      await this.sl.fetchAllArticleGroupsPaged(10);

    let upserts = 0,
      failures = 0;
    for (const g of items) {
      try {
        await this.prisma.articleGroupMirror.upsert({
          where: { externalId: g.id },
          create: {
            externalId: g.id,
            name: g.name,
            description: g.description ?? null,
            parentId: g.parentId ?? null,
            sortOrder: g.sortOrder ?? 0,
            active: g.isActive ?? true,
            updatedAt: g.updatedAt ? new Date(g.updatedAt) : new Date(),
          },
          update: {
            name: g.name,
            description: g.description ?? null,
            parentId: g.parentId ?? null,
            sortOrder: g.sortOrder ?? 0,
            active: g.isActive ?? true,
            updatedAt: g.updatedAt ? new Date(g.updatedAt) : new Date(),
          },
        });
        upserts++;
      } catch (e: unknown) {
        failures++;
        this.logger.error(
          `group_upsert_failed ext=${g.id} msg=${errorMessage(e)}`,
        );
      }
    }
    const took = Date.now() - started;
    this.logger.log(
      `groups_sync_done read=${items.length} upserts=${upserts} failures=${failures} took_ms=${took}`,
    );
    return { read: items.length, upserts, failures, tookMs: took };
  }

  // ---- Then articles (paged) ----
  async syncArticles(pageSize = 10) {
    const started = Date.now();

    // cache group mapping: externalId -> id
    const groups = await this.prisma.articleGroupMirror.findMany({
      select: { id: true, externalId: true },
    });
    const groupIdByExt = new Map(groups.map((g) => [g.externalId, g.id]));
    this.logger.log(`groups_cached=${groups.length}`);

    const items: SlArticle[] = await this.sl.fetchAllArticlesPaged(pageSize);
    this.logger.log(
      `articles_fetched_total=${items.length} page_size=${pageSize}`,
    );

    let upserts = 0,
      failures = 0,
      skippedMissingGroup = 0;
    for (const it of items) {
      try {
        const groupId = groupIdByExt.get(it.groupExternalId);
        if (!groupId) {
          skippedMissingGroup++;
          this.logger.warn(
            `article_skip_missing_group ext=${it.externalId} group=${it.groupExternalId}`,
          );
          continue;
        }

        await this.prisma.articleMirror.upsert({
          where: { externalId: it.externalId },
          create: {
            externalId: it.externalId,
            articleGroupId: groupId,
            sku: it.sku,
            ean: it.ean,
            title: it.title,
            description: it.description,
            attributes: it.attributes
              ? (it.attributes as unknown as Prisma.InputJsonValue)
              : Prisma.JsonNull,
            uom: it.uom,
            active: it.active,
            updatedAt: it.updatedAt ? new Date(it.updatedAt) : new Date(),
          },
          update: {
            articleGroupId: groupId,
            sku: it.sku,
            ean: it.ean,
            title: it.title,
            description: it.description,
            attributes: it.attributes
              ? (it.attributes as unknown as Prisma.InputJsonValue)
              : Prisma.JsonNull,
            uom: it.uom,
            active: it.active,
            updatedAt: it.updatedAt ? new Date(it.updatedAt) : new Date(),
          },
        });
        upserts++;
      } catch (e: unknown) {
        failures++;
        this.logger.error(
          `article_upsert_failed ext=${it.externalId} msg=${errorMessage(e)}`,
        );
      }
    }

    const took = Date.now() - started;
    this.logger.log(
      `articles_sync_done seen=${items.length} upserts=${upserts} skipped_missing_group=${skippedMissingGroup} failures=${failures} took_ms=${took}`,
    );
    return {
      totalSeen: items.length,
      upserts,
      skippedMissingGroup,
      failures,
      tookMs: took,
    };
  }
}
