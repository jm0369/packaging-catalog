'use server';

import { adminFetch } from '@/lib/admin-client';

export async function setPrimaryImage(
  externalId: string,
  mediaId: string
): Promise<{ ok: boolean; message?: string }> {
  if (!externalId || !mediaId) {
    return { ok: false, message: 'externalId and mediaId are required' };
  }

  const res = await adminFetch(
    `/admin/article-groups/${encodeURIComponent(externalId)}/media`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mediaId }),
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { ok: false, message: `Failed: ${res.status} ${text}` };
  }
  return { ok: true };
}