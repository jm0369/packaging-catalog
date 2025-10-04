import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${process.env.NEXT_PUBLIC_SITE_BASE}/`, changeFrequency: 'daily', priority: 0.7 },
    { url: `${process.env.NEXT_PUBLIC_SITE_BASE}/impressum`, priority: 0.3 },
    { url: `${process.env.NEXT_PUBLIC_SITE_BASE}/privacy`, priority: 0.3 },
  ];
}