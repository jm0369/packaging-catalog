// apps/admin/src/lib/admin-api.ts
import { z } from 'zod';
import { adminFetch } from './admin-client';

const groupSchema = z.object({
  id: z.string(),
  externalId: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  active: z.boolean(),
});

const pagedGroupsSchema = z.object({
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative(),
  data: z.array(groupSchema),
});

export type PagedGroups = z.infer<typeof pagedGroupsSchema>;

export type AdminGroup = z.infer<typeof groupSchema>;

/**
 * Fetch a single article group by externalId.
 */
export async function fetchGroup(externalId: string): Promise<AdminGroup | null> {
    console.log('fetchGroup', externalId);
  try {
    const res = await adminFetch(`/admin/article-groups/${(externalId)}`);
    
    console.log('fetchGroup response', res.status);
    if (!res.ok) return null;
    const json = await res.json();
    // API might return `{ data: {...} }` or just `{...}`
    const obj = (json as { data?: unknown }).data ?? json;
    const parsed = groupSchema.safeParse(obj);
    if (!parsed.success) {
      console.error('fetchGroup validation error:', parsed.error.flatten());
      return null;
    }
    return parsed.data;
  } catch (err) {
    console.error('fetchGroup failed:', err);
    return null;
  }
}

/**
 * Fetch all groups (admin, includes inactive).
 */
export async function fetchGroups(params?: {
  limit?: number;
  offset?: number;
  q?: string;
}): Promise<PagedGroups> {
  const sp = new URLSearchParams();
  if (params?.limit != null) sp.set('limit', String(params.limit));
  if (params?.offset != null) sp.set('offset', String(params.offset));
  if (params?.q) sp.set('q', params.q);

  // always goes through admin proxy → /api/groups/all
  const res = await adminFetch(`/admin/article-groups/all?${sp.toString()}`);
  if (!res.ok) {
    throw new Error(`fetchGroups failed with status ${res.status}`);
  }

  const json = await res.json();
  return pagedGroupsSchema.parse(json);
}

export async function updateArticleActive(
  externalId: string,
  active: boolean
): Promise<boolean> {
  const res = await adminFetch(
    `/admin/articles/${encodeURIComponent(externalId)}/active`,
    {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ active }),
    }
  );
  return res.ok;
}