import 'server-only';
import { z } from 'zod';

const API = process.env.NEXT_PUBLIC_API_BASE!;

const group = z.object({
  id: z.string(),
  externalId: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
});

const pagedGroups = z.object({
  total: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  offset: z.number().int().nonnegative(),
  data: z.array(group),
});

export type Group = z.infer<typeof group>;
export type PagedGroups = z.infer<typeof pagedGroups>;

export async function fetchGroupsPage(opts?: {
  q?: string;
  limit?: number;
  offset?: number;
}): Promise<PagedGroups> {
  const sp = new URLSearchParams();
  if (opts?.q) sp.set('q', opts.q);
  if (opts?.limit != null) sp.set('limit', String(opts.limit));
  if (opts?.offset != null) sp.set('offset', String(opts.offset));

  const res = await fetch(`${API}/api/article-groups?${sp.toString()}`, {
    next: { revalidate: 60 }, // short cache for admin
  });
  if (!res.ok) throw new Error(`Groups fetch failed: ${res.status}`);
  const json = await res.json();
  return pagedGroups.parse(json);
}