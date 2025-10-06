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

interface DriveFile {
  id: string;
  name: string;
  mimeType?: string;
  md5Checksum?: string;
}

interface SyncStats {
  unchanged: number;
  added: number;
  updated: number;
  deleted: number;
  failed: number;
  skipped: number;
}

function normalizeForMatching(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function parseTargetFromName(
  name: string,
  articles: Array<{ externalId: string; title: string; sku: string | null }>,
  groups: Array<{ externalId: string; name: string }>
): { type: 'article' | 'group'; id: string; matched: string; sortOrder: number } | null {
  const baseName = name.replace(/\.[a-z0-9]+$/i, '');
  const normalizedFileName = normalizeForMatching(baseName);
  
  // Check if filename contains "E" followed by digits (article image indicator)
  // Extract sort order: "E 01", "E01", "E 14-2", "E00", "E 00-2" etc.
  const eMatch = baseName.match(/\bE\s*(\d+(?:-\d+)?)\b/i);
  
  if (eMatch) {
    // This is an article image
    const sortOrderStr = eMatch[1].replace(/-/g, '');
    const sortOrder = parseInt(sortOrderStr, 10);
    
    // Try to find any article whose externalId, title, or SKU appears in the filename
    // Sort by normalized length (longest first) to prefer more specific matches
    const sortedArticles = [...articles].sort((a, b) => {
      const aNormLen = Math.max(
        normalizeForMatching(a.externalId).length,
        normalizeForMatching(a.title).length,
        a.sku ? normalizeForMatching(a.sku).length : 0
      );
      const bNormLen = Math.max(
        normalizeForMatching(b.externalId).length,
        normalizeForMatching(b.title).length,
        b.sku ? normalizeForMatching(b.sku).length : 0
      );
      return bNormLen - aNormLen;
    });
    
    for (const article of sortedArticles) {
      const normalized = normalizeForMatching(article.externalId);
      const normalizedTitle = normalizeForMatching(article.title);
      const normalizedSku = article.sku ? normalizeForMatching(article.sku) : '';
      
      // Check if any identifier appears in the filename
      // Use minimum length of 5 to avoid false positives with short codes
      if (
        (normalized.length >= 4 && normalizedFileName.includes(normalized)) ||
        (normalizedTitle.length >= 4 && normalizedFileName.includes(normalizedTitle)) ||
        (normalizedSku.length >= 4 && normalizedFileName.includes(normalizedSku))
      ) {
        return { type: 'article', id: article.externalId, matched: article.title, sortOrder };
      }
    }
    
    // If no match found with strict criteria, try fuzzy matching
    // Extract the main part before "E" and try partial matching
    const beforeE = baseName.substring(0, eMatch.index).trim();
    const normalizedBeforeE = normalizeForMatching(beforeE);
    
    for (const article of sortedArticles) {
      const normalized = normalizeForMatching(article.externalId);
      const normalizedTitle = normalizeForMatching(article.title);
      const normalizedSku = article.sku ? normalizeForMatching(article.sku) : '';
      
      // Calculate match score based on how much of the identifier matches
      const calcMatchScore = (identifier: string) => {
        if (identifier.length < 3) return 0;
        // Check if identifier is contained in filename
        if (normalizedBeforeE.includes(identifier)) return identifier.length;
        // Check if filename starts with identifier
        if (normalizedBeforeE.startsWith(identifier.substring(0, Math.min(identifier.length, 6)))) {
          return identifier.length * 0.8;
        }
        return 0;
      };
      
      const scoreId = calcMatchScore(normalized);
      const scoreTitle = calcMatchScore(normalizedTitle);
      const scoreSku = calcMatchScore(normalizedSku);
      const maxScore = Math.max(scoreId, scoreTitle, scoreSku);
      
      if (maxScore >= 3) {
        return { type: 'article', id: article.externalId, matched: article.title, sortOrder };
      }
    }
  } else {
    // No "E" marker, so this is likely a group image
    // Extract sort order from trailing number: "PC P FBS 14", "PC P B 02 14-2", "PC P LB 10 00_"
    const groupMatch = baseName.match(/\s+(\d+(?:-\d+)?)\s*_?\s*$/);
    if (groupMatch) {
      const sortOrderStr = groupMatch[1].replace(/-/g, '');
      const sortOrder = parseInt(sortOrderStr, 10);
      
      // Try to find any group whose externalId or name appears in the filename
      // Sort by normalized length (longest first) to prefer more specific matches
      const sortedGroups = [...groups].sort((a, b) => {
        const aNormLen = Math.max(
          normalizeForMatching(a.externalId).length,
          normalizeForMatching(a.name).length
        );
        const bNormLen = Math.max(
          normalizeForMatching(b.externalId).length,
          normalizeForMatching(b.name).length
        );
        return bNormLen - aNormLen;
      });
      
      for (const group of sortedGroups) {
        const normalized = normalizeForMatching(group.externalId);
        const normalizedName = normalizeForMatching(group.name);
        
        // Check if any identifier appears in the filename
        if (
          (normalized.length >= 4 && normalizedFileName.includes(normalized)) ||
          (normalizedName.length >= 4 && normalizedFileName.includes(normalizedName))
        ) {
          return { type: 'group', id: group.externalId, matched: group.name, sortOrder };
        }
      }
      
      // Fuzzy matching for groups
      const beforeNumber = baseName.substring(0, groupMatch.index).trim();
      const normalizedBeforeNumber = normalizeForMatching(beforeNumber);
      
      for (const group of sortedGroups) {
        const normalized = normalizeForMatching(group.externalId);
        const normalizedName = normalizeForMatching(group.name);
        
        const calcMatchScore = (identifier: string) => {
          if (identifier.length < 3) return 0;
          if (normalizedBeforeNumber.includes(identifier)) return identifier.length;
          if (normalizedBeforeNumber.startsWith(identifier.substring(0, Math.min(identifier.length, 6)))) {
            return identifier.length * 0.8;
          }
          return 0;
        };
        
        const scoreId = calcMatchScore(normalized);
        const scoreName = calcMatchScore(normalizedName);
        const maxScore = Math.max(scoreId, scoreName);
        
        if (maxScore >= 3) {
          return { type: 'group', id: group.externalId, matched: group.name, sortOrder };
        }
      }
    }
  }
  
  return null;
}

async function downloadFile(drive: any, fileId: string, fileName: string): Promise<Buffer | null> {
  let attempt = 0;
  while (attempt < 5) {
    try {
      const res = await drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'arraybuffer' }
      );
      return Buffer.from(res.data as ArrayBuffer);
    } catch (e: any) {
      attempt++;
      const wait = Math.min(1000 * 2 ** attempt, 15_000);
      console.warn(`Download error for ${fileName}: ${e?.message ?? e}. Retry ${attempt}/5 in ${wait}ms`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  return null;
}

async function uploadMedia(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string | null> {
  const form = new FormData();
  const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
  form.append('file', blob, fileName);

  let attempt = 0;
  while (attempt < 5) {
    try {
      const resp = await fetch(`${ADMIN_BASE}/admin/media/upload`, {
        method: 'POST',
        headers: { 'x-admin-secret': ADMIN_SECRET },
        body: form as any,
      });
      
      if (resp.ok) {
        const data = (await resp.json()) as { id: string };
        return data.id;
      }
      
      if (resp.status >= 500 || resp.status === 429) {
        attempt++;
        const wait = Math.min(1000 * 2 ** attempt, 15_000);
        console.warn(`Upload ${fileName} got ${resp.status}. Retry ${attempt}/5 in ${wait}ms`);
        await new Promise((r) => setTimeout(r, wait));
      } else {
        const errorText = await resp.text().catch(() => '');
        console.error(`Upload failed ${fileName} (${resp.status}): ${errorText}`);
        return null;
      }
    } catch (e: any) {
      attempt++;
      const wait = Math.min(1000 * 2 ** attempt, 15_000);
      console.warn(`Upload error ${fileName}: ${e?.message ?? e}. Retry ${attempt}/5 in ${wait}ms`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  return null;
}

async function linkMedia(
  targetType: 'article' | 'group',
  targetId: string,
  mediaId: string,
  sortOrder: number
): Promise<boolean> {
  const linkPath =
    targetType === 'article'
      ? `/admin/articles/${encodeURIComponent(targetId)}/media`
      : `/admin/article-groups/${encodeURIComponent(targetId)}/media`;

  let attempt = 0;
  while (attempt < 3) {
    try {
      const resp = await fetch(`${ADMIN_BASE}${linkPath}`, {
        method: 'POST',
        headers: {
          'x-admin-secret': ADMIN_SECRET,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ mediaId, sortOrder }),
      });

      if (resp.ok) {
        return true;
      }

      const errorText = await resp.text().catch(() => '');
      
      // Check for duplicate sortOrder error
      if (resp.status === 500 && errorText.includes('Unique constraint failed')) {
        console.warn(`   ⚠️  Duplicate sortOrder ${sortOrder}, retrying with next available...`);
        // Increment sortOrder and retry
        sortOrder = sortOrder + 1;
        attempt++;
        continue;
      }

      // Check if it's routing to wrong endpoint
      if (errorText.includes('groupMediaLink') && targetType === 'article') {
        console.error(`   ✗ API routing error: article route calling groupMediaLink.create()`);
        return false;
      }

      console.error(`Link failed (${resp.status}): ${errorText}`);
      return false;
      
    } catch (e: any) {
      console.error(`   ✗ Link error: ${e?.message}`);
      return false;
    }
  }
  
  return false;
}

async function main() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('🔄 Starting Drive sync...\n');
    
    // Load articles and groups
    const [articles, groups] = await Promise.all([
      prisma.articleMirror.findMany({
        select: { externalId: true, title: true, sku: true },
      }),
      prisma.articleGroupMirror.findMany({
        select: { externalId: true, name: true },
      }),
    ]);
    
    console.log(`📚 Loaded ${articles.length} articles and ${groups.length} groups`);
    
    // Initialize Drive API
    const jwt = new google.auth.JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
    const drive = google.drive({ version: 'v3', auth: jwt });

    // Fetch all files from Drive folder
    const q = [
      `'${DRIVE_FOLDER_ID}' in parents`,
      'trashed = false',
      "(mimeType contains 'image/')",
    ].join(' and ');

    const driveFiles: DriveFile[] = [];
    let pageToken: string | undefined;

    console.log('☁️  Fetching files from Drive...');
    do {
      const res = await drive.files.list({
        q,
        fields: 'nextPageToken, files(id,name,mimeType,md5Checksum)',
        pageSize: 1000,
        pageToken,
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      });
      const batch = res.data.files ?? [];
      driveFiles.push(
        ...batch.map((f) => ({
          id: f.id!,
          name: f.name!,
          mimeType: f.mimeType,
          md5Checksum: f.md5Checksum,
        }))
      );
      pageToken = res.data.nextPageToken ?? undefined;
    } while (pageToken);

    console.log(`Found ${driveFiles.length} image(s) in Drive\n`);

    // Load current sync state from DB
    const syncStates = await prisma.driveSyncState.findMany();
    const syncMap = new Map(syncStates.map((s) => [s.driveFileId, s]));
    
    console.log(`💾 Current sync state: ${syncStates.length} tracked files\n`);

    // Determine actions
    const driveFileIds = new Set(driveFiles.map((f) => f.id));
    const toDelete = syncStates.filter((s) => !driveFileIds.has(s.driveFileId));
    const toProcess = driveFiles.filter((f) => {
      const existing = syncMap.get(f.id);
      if (!existing) return true; // New file
      // Check if checksum changed (Drive uses MD5)
      return existing.driveChecksum !== f.md5Checksum;
    });

    console.log(`📊 Actions needed:`);
    console.log(`   - Delete: ${toDelete.length}`);
    console.log(`   - Process (new/updated): ${toProcess.length}`);
    console.log(`   - Unchanged: ${driveFiles.length - toProcess.length}\n`);

    const stats: SyncStats = {
      unchanged: driveFiles.length - toProcess.length,
      added: 0,
      updated: 0,
      deleted: 0,
      failed: 0,
      skipped: 0,
    };

    // 1. Delete removed files
    if (toDelete.length > 0) {
      console.log('🗑️  Removing deleted files...');
      for (const sync of toDelete) {
        try {
          // Delete media asset (cascade will remove links)
          if (sync.mediaAssetId) {
            await prisma.mediaAsset.delete({
              where: { id: sync.mediaAssetId },
            });
          }
          // Delete sync state
          await prisma.driveSyncState.delete({
            where: { id: sync.id },
          });
          stats.deleted++;
          console.log(`   ✓ Deleted: ${sync.driveFileName}`);
        } catch (e: any) {
          stats.failed++;
          console.error(`   ✗ Failed to delete ${sync.driveFileName}: ${e?.message}`);
        }
      }
      console.log();
    }

    // 2. Process new/updated files
    if (toProcess.length > 0) {
      console.log('⬇️  Processing files...\n');
      const limit = pLimit(3);

      await Promise.all(
        toProcess.map((file, idx) =>
          limit(async () => {
            const target = parseTargetFromName(file.name, articles, groups);
            if (!target) {
              stats.skipped++;
              console.log(`[${idx + 1}/${toProcess.length}] SKIP  ${file.name} (no match)`);
              return;
            }

            const existing = syncMap.get(file.id);
            const isUpdate = !!existing;

            console.log(
              `[${idx + 1}/${toProcess.length}] ${isUpdate ? 'UPDATE' : 'ADD'}  ${file.name} → ${target.type}:${target.id}`
            );

            // Download file
            const buffer = await downloadFile(drive, file.id, file.name);
            if (!buffer) {
              stats.failed++;
              console.error(`   ✗ Download failed`);
              return;
            }

            const checksum = crypto.createHash('sha256').update(buffer).digest('hex');

            // Upload to media service
            const mediaId = await uploadMedia(buffer, file.name, file.mimeType ?? 'image/jpeg');
            if (!mediaId) {
              stats.failed++;
              console.error(`   ✗ Upload failed`);
              return;
            }

            // Link to target
            const linked = await linkMedia(target.type, target.id, mediaId, target.sortOrder);
            if (!linked) {
              stats.failed++;
              console.error(`   ✗ Link failed`);
              return;
            }

            // Update sync state
            await prisma.driveSyncState.upsert({
              where: { driveFileId: file.id },
              create: {
                driveFileId: file.id,
                driveFileName: file.name,
                driveChecksum: file.md5Checksum,
                mediaAssetId: mediaId,
                targetType: target.type,
                targetId: target.id,
                sortOrder: target.sortOrder,
              },
              update: {
                driveFileName: file.name,
                driveChecksum: file.md5Checksum,
                mediaAssetId: mediaId,
                lastSyncedAt: new Date(),
              },
            });

            if (isUpdate) {
              stats.updated++;
              // Delete old media asset if changed
              if (existing.mediaAssetId && existing.mediaAssetId !== mediaId) {
                await prisma.mediaAsset.delete({
                  where: { id: existing.mediaAssetId },
                }).catch(() => {});
              }
            } else {
              stats.added++;
            }

            console.log(`   ✓ Success (mediaId=${mediaId}, sha256=${checksum.slice(0, 8)}…)`);
          })
        )
      );
    }

    console.log('\n✅ Sync complete!');
    console.log(`   Unchanged: ${stats.unchanged}`);
    console.log(`   Added:     ${stats.added}`);
    console.log(`   Updated:   ${stats.updated}`);
    console.log(`   Deleted:   ${stats.deleted}`);
    console.log(`   Skipped:   ${stats.skipped}`);
    console.log(`   Failed:    ${stats.failed}`);
    
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});