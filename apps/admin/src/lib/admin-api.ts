// apps/admin/src/lib/admin-api.ts
import { z } from 'zod';
import { adminFetch } from './admin-client';

const groupSchema = z.object({
  id: z.string(),
  externalId: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
});

export type AdminGroup = z.infer<typeof groupSchema>;

/**
 * Fetch a single article group by externalId.
 */
export async function fetchGroup(externalId: string): Promise<AdminGroup | null> {
    console.log('fetchGroup', externalId);
  try {
    const res = await adminFetch(`/api/article-groups/${encodeURIComponent(externalId)}`);
    
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