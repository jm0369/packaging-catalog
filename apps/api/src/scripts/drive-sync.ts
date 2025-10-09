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

async function main() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('🔄 Starting Drive sync...\n');
    
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
            const existing = syncMap.get(file.id);
            const isUpdate = !!existing;

            console.log(
              `[${idx + 1}/${toProcess.length}] ${isUpdate ? 'UPDATE' : 'ADD'}  ${file.name}`
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

            // Update sync state (no automatic linking - done manually via admin UI)
            await prisma.driveSyncState.upsert({
              where: { driveFileId: file.id },
              create: {
                driveFileId: file.id,
                driveFileName: file.name,
                driveChecksum: file.md5Checksum,
                mediaAssetId: mediaId,
                targetType: 'article', // placeholder, not used for linking anymore
                targetId: '',
                sortOrder: 0,
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

            console.log(`   ✓ Uploaded (mediaId=${mediaId}, sha256=${checksum.slice(0, 8)}…)`);
            console.log(`   ℹ️  Link manually via admin UI at /media/${mediaId}`);
          })
        )
      );
    }

    console.log('\n✅ Sync complete!');
    console.log(`   Unchanged: ${stats.unchanged}`);
    console.log(`   Added:     ${stats.added}`);
    console.log(`   Updated:   ${stats.updated}`);
    console.log(`   Deleted:   ${stats.deleted}`);
    console.log(`   Failed:    ${stats.failed}`);
    console.log(`\n💡 New/updated media assets can be linked via admin UI: ${ADMIN_BASE.replace(/:\d+$/, ':3001')}/media`);
    
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});