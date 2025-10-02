import ky from 'ky';
import { z } from 'zod';
import { Paged } from './types';

const imageItem = z.object({
  id: z.string(),
  mediaId: z.string(),
  altText: z.string().nullable(),
  sortOrder: z.number().int(),
  url: z.string().url().nullable(), // CDN URL or null
  width: z.number().int().nullable().optional(),
  height: z.number().int().nullable().optional(),
  mime: z.string().nullable().optional(),
});

export const articleDetail = z.object({
  id: z.string(),
  externalId: z.string(),
  sku: z.string().nullable().optional(),
  ean: z.string().nullable().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  uom: z.string().nullable().optional(),
  active: z.boolean().optional().default(true),
  updatedAt: z.string().optional(),
  imageUrl: z.string().url().nullable().optional(),  // primary
  images: z.array(imageItem).default([]),            // ✅ new
  group: z
    .object({ id: z.string(), externalId: z.string(), name: z.string() })
    .nullable()
    .optional(),
}).passthrough();

export type Article = z.infer<typeof articleDetail>;

export async function fetchArticle(externalId: string): Promise<Article | null> {
  const res = await ky.get(`${API}/api/articles/${externalId}`, {
    throwHttpErrors: false,
    next: { revalidate: 600 },
  });
  if (!res.ok) return null;

  const json = await res.json();
  try {
    return articleDetail.parse(json);
  } catch (e) {
    console.error('Article detail parse failed:', e);
    return null;
  }
}

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

export async function fetchGroups(params: {
  q?: string;
  limit?: number;
  offset?: number;
}): Promise<PagedGroups> {
  const sp = new URLSearchParams();
  if (params.limit != null) sp.set('limit', String(params.limit));
  if (params.offset != null) sp.set('offset', String(params.offset));
  if (params.q) sp.set('q', params.q);

  const res = await ky
    .get(`${API}/api/article-groups?${sp.toString()}`, { next: { revalidate: 600 } })
    .json();

  return pagedGroups.parse(res);
}

const groupMini = z.object({
  id: z.string(),
  externalId: z.string(),
  name: z.string(),
}).partial({ name: true }); // be flexible if name is omitted

const isoString = z.string().refine(
  (s) => !Number.isNaN(Date.parse(s)),
  { message: 'updatedAt must be ISO date string' }
);

// Accept either absolute URL, relative path, or null/undefined.
const imageUrlSchema = z.union([
  z.string().min(1),  // allow relative or absolute; we'll trust backend
  z.null(),
  z.undefined(),
]);

const groupSchema = z.object({
  id: z.string(),
  externalId: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  imageUrl: imageUrlSchema.optional(),
  images: z.array(imageItem).default([]),            // ✅ new
});

const pagedArticles = z.object({
  total: z.number(), limit: z.number(), offset: z.number(),
  data: z.array(z.object({
    id: z.string(), externalId: z.string(),
    sku: z.string().nullable(), ean: z.string().nullable(),
    title: z.string(), description: z.string().nullable(),
    uom: z.string().nullable(),
    active: z.boolean(), updatedAt: z.string(), articleGroupId: z.string(),
  })),
});


export async function fetchGroup(externalId: string) {
    const json = await ky.get(`${API}/api/article-groups/${externalId}`, { next: { revalidate: 600 } }).json();
    return groupSchema.parse(json);
}

export async function fetchGroupArticles(externalId: string, params?: { q?: string; limit?: number; offset?: number }): Promise<Paged<Article>> {
  const sp = new URLSearchParams();
  if (params?.q) sp.set('q', params.q);
  if (params?.limit) sp.set('limit', String(params.limit));
  if (params?.offset) sp.set('offset', String(params.offset));
  const json = await ky.get(`${API}/api/article-groups/${externalId}/articles?${sp.toString()}`, { next: { revalidate: 600 } }).json();
  return pagedArticles.parse(json);
}