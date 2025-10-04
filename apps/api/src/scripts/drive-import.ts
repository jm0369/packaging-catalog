// apps/api/src/scripts/drive-import.ts
/* eslint-disable no-console */
import 'dotenv/config';
import { google } from 'googleapis';
import pLimit from 'p-limit';
import crypto from 'node:crypto';

// If you need node FormData polyfill:
// import FormData from 'form-data';

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

// Filename ↔ mapping helpers
function normalizeGroupId(raw: string) {
  // Accept both underscores or spaces in filenames; convert underscores back to spaces
  return raw.replace(/_/g, ' ').trim();
}
function parseTargetFromName(name: string): { type: 'article' | 'group'; id: string } | null {
  // GROUP__<externalId>.*  → group
  const mGroup = name.match(/^GROUP__(.+)\.[a-z0-9]+$/i);
  if (mGroup) return { type: 'group', id: normalizeGroupId(mGroup[1]) };

  // <externalId>.* → article (strip trailing decorations like -1, _front)
  const base = name.replace(/\.[a-z0-9]+$/i, '');
  const art = base.match(/^([A-Za-z0-9]+)(?:[\-_].*)?$/);
  if (art) return { type: 'article', id: art[1] };

  return null;
}

async function main() {
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
        const target = parseTargetFromName(file.name);
        if (!target) {
          skipped++;
          console.log(`[${index + 1}/${files.length}] SKIP  name=${file.name} (unrecognized pattern)`);
          return;
        }

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
          console.error(`FAIL download ${file.name}`);
          return;
        }

        // Optional: skip duplicate uploads by checksum (fast detect)
        const checksum = crypto.createHash('sha256').update(buf).digest('hex');

        // Upload to your admin API (multipart)
        const form = new FormData();
        form.append('file', new Blob([buf], { type: file.mimeType ?? 'application/octet-stream' }), file.name);

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
          console.error(`FAIL upload ${file.name} (${uploadResp?.status})`);
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
          body: JSON.stringify({ mediaId, sortOrder: 9999 }), // append to end
        });

        if (!linkResp.ok) {
          failed++;
          console.error(`FAIL link ${file.name} -> ${target.type}:${target.id} (${linkResp.status})`);
          return;
        }

        success++;
        console.log(
          `[${index + 1}/${files.length}] OK    name=${file.name} → ${target.type}:${target.id} (mediaId=${mediaId}, sha256=${checksum.slice(0,8)}…)`
        );
      })
    )
  );

  console.log(`\nDone. success=${success}, skipped=${skipped}, failed=${failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});