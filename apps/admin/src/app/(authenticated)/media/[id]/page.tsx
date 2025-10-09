export const revalidate = 0;

import { notFound } from 'next/navigation';
import { MediaAssetDetailClient } from '@/components/media/media-asset-detail-client';

type MediaAssetDetail = {
  id: string;
  key: string;
  mime: string;
  width?: number | null;
  height?: number | null;
  sizeBytes?: number | null;
  checksum?: string | null;
  variants?: any;
  driveSync?: {
    driveFileId: string;
    driveFileName: string;
    lastSyncedAt: string;
  } | null;
  usedInGroups: Array<{
    linkId: string;
    group: {
      id: string;
      externalId: string;
      name: string;
      description?: string | null;
    };
    altText?: string | null;
    sortOrder: number;
  }>;
  usedInArticles: Array<{
    linkId: string;
    article: {
      id: string;
      externalId: string;
      title: string;
      description?: string | null;
    };
    altText?: string | null;
    sortOrder: number;
  }>;
  usedInCategories: Array<{
    linkId: string;
    category: {
      id: string;
      name: string;
      type: string;
      color: string;
      description?: string | null;
    };
    altText?: string | null;
    sortOrder: number;
  }>;
};

async function fetchMediaAsset(id: string): Promise<MediaAssetDetail | null> {
  const API = process.env.NEXT_PUBLIC_API_BASE!;
  const ADMIN = process.env.ADMIN_SHARED_SECRET!;
  
  const r = await fetch(`${API}/admin/media-assets/${id}`, {
    cache: 'no-store',
    headers: {
      'x-admin-secret': ADMIN,
    },
  });
  
  if (r.status === 404) return null;
  if (!r.ok) throw new Error('Failed to load media asset');
  return r.json();
}

export default async function MediaAssetDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const asset = await fetchMediaAsset(id);
  
  if (!asset) {
    notFound();
  }

  const CDN_BASE = process.env.NEXT_PUBLIC_CDN_BASE || '';

  return <MediaAssetDetailClient asset={asset} cdnBase={CDN_BASE} />;
}
