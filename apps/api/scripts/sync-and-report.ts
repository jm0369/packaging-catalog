/* eslint-disable no-console */
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import type { INestApplicationContext } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { SyncService } from '../src/sync/sync.service';
import { writeFileSync } from 'node:fs';

const EXIT_NONZERO_ON_WARN = process.env.EXIT_NONZERO_ON_WARN !== '0';
const SKIP_SYNC = process.env.SKIP_SYNC === '1';

async function main() {
  const app: INestApplicationContext = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  const prisma = app.get(PrismaService);

  let groupsResult: any = null;
  let articlesResult: any = null;

  if (!SKIP_SYNC) {
    try {
      const sync = app.get(SyncService);
      console.log('▶ Running SelectLine sync: groups → articles...');
      groupsResult = await sync.syncArticleGroups();
      articlesResult = await sync.syncArticles();
      console.log('✔ Sync completed.');
    } catch {
      console.warn('⚠ No SyncService found or sync failed; proceeding to DB report.');
    }
  } else {
    console.log('ℹ SKIP_SYNC=1 → Skipping SelectLine sync; producing DB report only.');
  }

  const [groupsCount, activeGroups, placeholderGroups, articlesCount] = await Promise.all([
    prisma.articleGroupMirror.count(),
    prisma.articleGroupMirror.count({ where: { active: true } }),
    prisma.articleGroupMirror.count({ where: { active: false } }),
    prisma.articleMirror.count(),
  ]);

  type Row = { count: bigint };
  const [orphansRow] = await prisma.$queryRaw<Row[]>`
    SELECT COUNT(*)::bigint AS count
    FROM "ArticleMirror" a
    JOIN "ArticleGroupMirror" g ON g.id = a."articleGroupId"
    WHERE g.active = false
  `;
  const orphanArticles = Number(orphansRow?.count ?? 0);

  const dupArticlesRows = await prisma.$queryRaw<{ externalId: string; c: bigint }[]>`
    SELECT "externalId", COUNT(*)::bigint AS c
    FROM "ArticleMirror"
    GROUP BY "externalId"
    HAVING COUNT(*) > 1
  `;
  const dupGroupsRows = await prisma.$queryRaw<{ externalId: string; c: bigint }[]>`
    SELECT "externalId", COUNT(*)::bigint AS c
    FROM "ArticleGroupMirror"
    GROUP BY "externalId"
    HAVING COUNT(*) > 1
  `;

  const summary = {
    sync: { groups: groupsResult ?? null, articles: articlesResult ?? null },
    db: {
      groups: { total: groupsCount, active: activeGroups, placeholders: placeholderGroups },
      articles: { total: articlesCount },
      orphanArticles,
      duplicateExternalIds: {
        articles: dupArticlesRows.length,
        groups: dupGroupsRows.length,
        samples: {
          articles: dupArticlesRows.slice(0, 5),
          groups: dupGroupsRows.slice(0, 5),
        },
      },
    },
  };

  // JSON output to console
  console.log('--- Sync & DB Summary (JSON) ----------------------');
  console.log(JSON.stringify(summary, null, 2));
  console.log('---------------------------------------------------');

  // Optionally write JSON to file for CI artifact
  const jsonPath = process.env.SYNC_REPORT_JSON;
  if (jsonPath) {
    try {
      writeFileSync(jsonPath, JSON.stringify(summary, null, 2), 'utf8');
      console.log(`📦 Wrote JSON report to: ${jsonPath}`);
    } catch (e) {
      console.error(`❌ Failed to write report to ${jsonPath}:`, e);
    }
  }

  // Markdown summary (unchanged)
  console.log('\n--- Sync & DB Summary (Markdown) ------------------');
  console.log('| Metric             | Value |');
  console.log('|--------------------|-------|');
  console.log(`| Groups (total)     | ${groupsCount} |`);
  console.log(`| Groups (active)    | ${activeGroups} |`);
  console.log(`| Groups (inactive)  | ${placeholderGroups} |`);
  console.log(`| Articles (total)   | ${articlesCount} |`);
  console.log(`| Orphan Articles    | ${orphanArticles} |`);
  console.log(`| Duplicate Groups   | ${dupGroupsRows.length} |`);
  console.log(`| Duplicate Articles | ${dupArticlesRows.length} |`);
  console.log('---------------------------------------------------\n');

  let hasProblems = false;
  if (orphanArticles > 0) hasProblems = true;
  if (placeholderGroups > 0) hasProblems = true;
  if (dupArticlesRows.length > 0 || dupGroupsRows.length > 0) hasProblems = true;

  await app.close();

  if (hasProblems && EXIT_NONZERO_ON_WARN) {
    console.error('❌ Issues detected (orphans/placeholders/duplicates). Failing.');
    process.exit(1);
  }
  console.log('✅ Report clean.');
  process.exit(0);
}

main().catch((e) => {
  console.error('❌ sync-and-report failed:', e);
  process.exit(1);
});