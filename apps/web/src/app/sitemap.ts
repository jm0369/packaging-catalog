import type { MetadataRoute } from 'next';
import { fetchGroups } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || 'http://localhost:3000';
  const { data } = await fetchGroups({ limit: 200, offset: 0 });
  const now = new Date().toISOString();

  const groupUrls = data.map((g) => ({
    url: `${base}/groups/${encodeURIComponent(g.externalId)}`,
    lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7,
  }));

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...groupUrls,
    { url: `${base}/(static)/impressum`, lastModified: now },
    { url: `${base}/(static)/privacy`, lastModified: now },
  ];
}