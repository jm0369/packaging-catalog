// apps/api/src/scripts/drive-import.ts
/* eslint-disable no-console */
import 'dotenv/config';
import { google } from 'googleapis';
import { PrismaClient } from '@prisma/client';
import pLimit from 'p-limit';
import crypto from 'node:crypto';

const ADMIN_BASE = process.env.ADMIN_BASE ?? 'http://localhost:3001';
const ADMIN_SECRET = process.env.ADMIN_SHARED_SECRET ?? 'change-me';
const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID!;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL!;
const GOOGLE_PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n');

if (!DRIVE_FOLDER_ID || !GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
  console.error('Missing Google/Drive envs: DRIVE_FOLDER_ID, GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY');
  process.exit(1);
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function backoff(attempt: number) {
  return Math.min(1000 * 2 ** attempt, 15_000);
}

interface ArticleData {
  externalId: string;
  title: string;
  sku: string | null;
}

interface ArticleGroupData {
  externalId: string;
  name: string;
}

// Smart normalization for matching
function normalizeForMatching(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric
    .trim();
}

// Pattern: (Article) E (number).jpg → Article image
// Pattern: (ArticleGroup) (number).jpg → Group image
function parseTargetFromName(
  name: string,
  articles: ArticleData[],
  groups: ArticleGroupData[]
): { type: 'article' | 'group'; id: string; matched: string; sortOrder: number } | null {
  // Remove file extension
  const baseName = name.replace(/\.[a-z0-9]+$/i, '');
  
  // Try to match article pattern: (Article) E (number)
  // The "E" indicates it's an article image
  const articleMatch = baseName.match(/^(.+?)\s+E\s+(\d+)$/i);
  if (articleMatch) {
    const searchTerm = normalizeForMatching(articleMatch[1]);
    const sortOrder = parseInt(articleMatch[2], 10);
    
    // Try to find matching article
    for (const article of articles) {
      const normalized = normalizeForMatching(article.externalId);
      const normalizedTitle = normalizeForMatching(article.title);
      const normalizedSku = article.sku ? normalizeForMatching(article.sku) : '';
      
      if (
        normalized === searchTerm ||
        normalizedTitle === searchTerm ||
        normalizedSku === searchTerm ||
        normalized.includes(searchTerm) ||
        searchTerm.includes(normalized)
      ) {
        return { type: 'article', id: article.externalId, matched: article.title, sortOrder };
      }
    }
  }
  
  // Try to match group pattern: (ArticleGroup) (number)
  // No "E" means it's a group image
  const groupMatch = baseName.match(/^(.+?)\s+(\d+)$/i);
  if (groupMatch) {
    const searchTerm = normalizeForMatching(groupMatch[1]);
    const sortOrder = parseInt(groupMatch[2], 10);
    
    // Try to find matching group
    for (const group of groups) {
      const normalized = normalizeForMatching(group.externalId);
      const normalizedName = normalizeForMatching(group.name);
      
      if (
        normalized === searchTerm ||
        normalizedName === searchTerm ||
        normalized.includes(searchTerm) ||
        searchTerm.includes(normalized)
      ) {
        return { type: 'group', id: group.externalId, matched: group.name, sortOrder };
      }
    }
  }
  
  return null;
}

async function main() {
  // Initialize Prisma client
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('Connected to database');
    
    // Load all articles and groups
    console.log('Loading articles and article groups from database...');
    const [articles, groups] = await Promise.all([
      prisma.articleMirror.findMany({
        select: {
          externalId: true,
          title: true,
          sku: true,
        },
      }),
      prisma.articleGroupMirror.findMany({
        select: {
          externalId: true,
          name: true,
        },
      }),
    ]);
    
    console.log(`Loaded ${articles.length} articles and ${groups.length} article groups`);
    
    // Auth
    const jwt = new google.auth.JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
    const drive = google.drive({ version: 'v3', auth: jwt });

    // List files in folder (images only)
    const q = [
      `'${DRIVE_FOLDER_ID}' in parents`,
      'trashed = false',
      "(mimeType contains 'image/')",
    ].join(' and ');

    const files: Array<{ id: string; name: string; mimeType?: string }> = [];
    let pageToken: string | undefined;

    console.log('Listing files from Drive folder…');

    do {
      const res = await drive.files.list({
        q,
        fields: 'nextPageToken, files(id,name,mimeType)',
        pageSize: 1000,
        pageToken,
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });
      const batch = res.data.files ?? [];
      files.push(...batch.map((f) => ({ id: f.id!, name: f.name!, mimeType: f.mimeType })));
      pageToken = res.data.nextPageToken ?? undefined;
    } while (pageToken);

    console.log(`Found ${files.length} image(s).`);

    // Concurrency + backoff
    const limit = pLimit(3);
    let success = 0;
    let skipped = 0;
    let failed = 0;

    await Promise.all(
      files.map((file, index) =>
        limit(async () => {
          // Try to find matching article or group
          const target = parseTargetFromName(file.name, articles, groups);
          if (!target) {
            skipped++;
            console.log(
              `[${index + 1}/${files.length}] SKIP  name=${file.name} (no matching article/group found)`
            );
            return;
          }

          console.log(
            `[${index + 1}/${files.length}] MATCH name=${file.name} → ${target.type}:${target.id} (${target.matched}) [sortOrder=${target.sortOrder}]`
          );

          // Download from Drive (stream to buffer)
          let attempt = 0;
          let buf: Buffer | null = null;
          while (attempt < 5) {
            try {
              const res = await drive.files.get(
                { fileId: file.id, alt: 'media' },
                { responseType: 'arraybuffer' }
              );
              buf = Buffer.from(res.data as ArrayBuffer);
              break;
            } catch (e: any) {
              attempt++;
              const wait = backoff(attempt);
              console.warn(`Download error for ${file.name}: ${e?.message ?? e}. Retry in ${wait}ms`);
              await sleep(wait);
            }
          }
          if (!buf) {
            failed++;
            console.error(`[${index + 1}/${files.length}] FAIL download ${file.name}`);
            return;
          }

          // Calculate checksum
          const checksum = crypto.createHash('sha256').update(buf).digest('hex');

          // Upload to your admin API (multipart)
          const form = new FormData();
          const blob = new Blob([new Uint8Array(buf)], { type: file.mimeType ?? 'application/octet-stream' });
          form.append('file', blob, file.name);

          let uploadResp: Response | null = null;
          attempt = 0;
          while (attempt < 5) {
            try {
              uploadResp = await fetch(`${ADMIN_BASE}/admin/media/upload`, {
                method: 'POST',
                headers: { 'x-admin-secret': ADMIN_SECRET },
                body: form as any,
              });
              if (uploadResp.ok) break;
              if (uploadResp.status >= 500 || uploadResp.status === 429) {
                attempt++;
                const wait = backoff(attempt);
                console.warn(`Upload ${file.name} got ${uploadResp.status}. Retry in ${wait}ms`);
                await sleep(wait);
              } else {
                break;
              }
            } catch (e: any) {
              attempt++;
              const wait = backoff(attempt);
              console.warn(`Upload error ${file.name}: ${e?.message ?? e}. Retry in ${wait}ms`);
              await sleep(wait);
            }
          }
          if (!uploadResp || !uploadResp.ok) {
            failed++;
            const errorText = uploadResp ? await uploadResp.text().catch(() => '') : '';
            console.error(
              `[${index + 1}/${files.length}] FAIL upload ${file.name} (${uploadResp?.status}) ${errorText}`
            );
            return;
          }
          const uploaded = (await uploadResp.json()) as { id: string };
          const mediaId = uploaded.id;

          // Link to article or group
          const linkPath =
            target.type === 'article'
              ? `/admin/articles/${encodeURIComponent(target.id)}/media`
              : `/admin/article-groups/${encodeURIComponent(target.id)}/media`;

          const linkResp = await fetch(`${ADMIN_BASE}${linkPath}`, {
            method: 'POST',
            headers: {
              'x-admin-secret': ADMIN_SECRET,
              'content-type': 'application/json',
            },
            body: JSON.stringify({ mediaId, sortOrder: target.sortOrder }),
          });

          if (!linkResp.ok) {
            failed++;
            const errorText = await linkResp.text().catch(() => '');
            console.error(
              `[${index + 1}/${files.length}] FAIL link ${file.name} → ${target.type}:${target.id} (${linkResp.status}) ${errorText}`
            );
            return;
          }

          success++;
          console.log(
            `[${index + 1}/${files.length}] ✓ OK  name=${file.name} → ${target.type}:${target.id} (${target.matched}) [sortOrder=${target.sortOrder}, mediaId=${mediaId}, sha256=${checksum.slice(0, 8)}…]`
          );
        })
      )
    );

    console.log(`\nDone. success=${success}, skipped=${skipped}, failed=${failed}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});