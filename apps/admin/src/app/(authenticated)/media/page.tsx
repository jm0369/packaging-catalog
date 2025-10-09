export const revalidate = 0;

import Link from 'next/link';

type MediaAsset = {
  id: string;
  key: string;
  mime: string;
  width?: number | null;
  height?: number | null;
  sizeBytes?: number | null;
  usedInGroups: Array<{ name: string; externalId: string }>;
  usedInArticles: Array<{ title: string; externalId: string }>;
  usedInCategories: Array<{ name: string; color: string }>;
};

async function fetchMediaAssets(): Promise<MediaAsset[]> {
  const API = process.env.NEXT_PUBLIC_API_BASE!;
  const ADMIN = process.env.ADMIN_SHARED_SECRET!;
  
  const r = await fetch(`${API}/admin/media-assets`, {
    cache: 'no-store',
    headers: {
      'x-admin-secret': ADMIN,
    },
  });
  
  if (!r.ok) throw new Error('Failed to load media assets');
  return r.json();
}

function formatBytes(bytes?: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function MediaAssetsPage() {
  const assets = await fetchMediaAssets();
  const CDN_BASE = process.env.NEXT_PUBLIC_CDN_BASE || '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Media Assets</h1>
        <div className="text-sm text-gray-600">
          {assets.length} asset{assets.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {assets.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">
            No media assets found.
          </div>
        ) : (
          assets.map((asset) => {
            const url = `${CDN_BASE}/${asset.key}`;
            const totalUsage = 
              asset.usedInGroups.length + 
              asset.usedInArticles.length + 
              asset.usedInCategories.length;

            return (
              <Link
                key={asset.id}
                href={`/media/${asset.id}`}
                className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-white"
              >
                <div className="aspect-square bg-gray-100 rounded mb-3 overflow-hidden flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt="Media asset"
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 truncate" title={asset.key}>
                    {asset.key.split('/').pop()}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>
                      {asset.width && asset.height
                        ? `${asset.width}×${asset.height}`
                        : '—'}
                    </span>
                    <span>{formatBytes(asset.sizeBytes)}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {totalUsage > 0 ? (
                      <>
                        <span className="px-2 py-0.5 rounded bg-green-100 text-green-800">
                          Used in {totalUsage}
                        </span>
                      </>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        Unused
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
