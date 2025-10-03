// apps/admin/src/lib/api.ts
import ky from 'ky';
import { act } from 'react';
import { z } from 'zod';

const API =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '') || 'http://localhost:3001';

// --- Schemas & Types ---------------------------------------------------------

export const groupSchema = z.object({
  id: z.string(),
  externalId: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  active: z.boolean(),
});

export type Group = z.infer<typeof groupSchema>;

const pagedGroupsSchema = z.object({
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative(),
  data: z.array(groupSchema),
});

export type PagedGroups = z.infer<typeof pagedGroupsSchema>;

// --- API calls ---------------------------------------------------------------

/**
 * List groups (server component friendly).
 * Mirrors your public read API: GET /api/article-groups
 */
export async function fetchGroups(params: {
  limit?: number;
  offset?: number;
  q?: string;
  includeInactive?: boolean; // when true, hit /api/groups/all (admin proxy)
} = {}): Promise<PagedGroups> {
  const { limit, offset, q, includeInactive } = params;

  const sp = new URLSearchParams();
  if (limit != null) sp.set('limit', String(limit));
  if (offset != null) sp.set('offset', String(offset));
  if (q) sp.set('q', q);

  const path = includeInactive ? '/api/groups/all' : '/api/article-groups';
  const url = `${API}${path}${sp.toString() ? `?${sp.toString()}` : ''}`;

  const res = await ky
    .get("/api/groups/all", { next: { revalidate: 600 } as RequestInit['next'] })
    .json<unknown>();

  return pagedGroupsSchema.parse(res);
}
/**
 * Get a single group by externalId.
 * Mirrors: GET /api/article-groups/:externalId
 */
export async function fetchGroup(
  externalId: string,
): Promise<Group | null> {
  try {
    const json = await ky
      .get(`${API}/api/article-groups/${externalId}`, {
        next: { revalidate: 600 } as RequestInit['next'],
      })
      .json();
    // Your backend returns the object directly (not wrapped), adjust if needed:
    return groupSchema.parse(json);
  } catch {
    return null;
  }
}