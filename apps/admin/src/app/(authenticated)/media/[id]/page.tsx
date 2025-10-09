export const revalidate = 0;

import Link from 'next/link';
import { notFound } from 'next/navigation';

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

function formatBytes(bytes?: number | null): string {
  if (!bytes) return 'Unknown';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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
  const url = `${CDN_BASE}/${asset.key}`;
  
  const totalUsage = 
    asset.usedInGroups.length + 
    asset.usedInArticles.length + 
    asset.usedInCategories.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/media" className="text-sm text-gray-600 hover:underline">
              ← Back to Media Assets
            </Link>
          </div>
          <h1 className="text-2xl font-semibold">Media Asset Detail</h1>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Preview */}
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-white">
            <div className="aspect-square bg-gray-100 rounded overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="Media asset"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-4 text-center">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Open in new tab →
              </a>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          {/* Metadata */}
          <div className="border rounded-lg p-4 bg-white space-y-3">
            <h2 className="font-semibold mb-3">Metadata</h2>
            
            <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
              <div className="text-gray-600">ID:</div>
              <div className="font-mono text-xs">{asset.id}</div>

              <div className="text-gray-600">Key:</div>
              <div className="font-mono text-xs break-all">{asset.key}</div>

              <div className="text-gray-600">MIME Type:</div>
              <div>{asset.mime}</div>

              <div className="text-gray-600">Dimensions:</div>
              <div>
                {asset.width && asset.height
                  ? `${asset.width} × ${asset.height} px`
                  : 'Unknown'}
              </div>

              <div className="text-gray-600">File Size:</div>
              <div>{formatBytes(asset.sizeBytes)}</div>

              {asset.checksum && (
                <>
                  <div className="text-gray-600">Checksum:</div>
                  <div className="font-mono text-xs break-all">{asset.checksum}</div>
                </>
              )}
            </div>
          </div>

          {/* Drive Sync Info */}
          {asset.driveSync && (
            <div className="border rounded-lg p-4 bg-white space-y-3">
              <h2 className="font-semibold mb-3">Google Drive Sync</h2>
              
              <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                <div className="text-gray-600">File Name:</div>
                <div>{asset.driveSync.driveFileName}</div>

                <div className="text-gray-600">Drive File ID:</div>
                <div className="font-mono text-xs break-all">
                  {asset.driveSync.driveFileId}
                </div>

                <div className="text-gray-600">Last Synced:</div>
                <div>{new Date(asset.driveSync.lastSyncedAt).toLocaleString()}</div>
              </div>
            </div>
          )}

          {/* Usage Summary */}
          <div className="border rounded-lg p-4 bg-white">
            <h2 className="font-semibold mb-3">Usage Summary</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Groups:</span>
                <span className="font-semibold">{asset.usedInGroups.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Articles:</span>
                <span className="font-semibold">{asset.usedInArticles.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Categories:</span>
                <span className="font-semibold">{asset.usedInCategories.length}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-gray-600">Total Usage:</span>
                <span className="font-bold">{totalUsage}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Details */}
      {totalUsage > 0 && (
        <div className="space-y-4">
          {/* Used in Groups */}
          {asset.usedInGroups.length > 0 && (
            <div className="border rounded-lg p-4 bg-white">
              <h2 className="font-semibold mb-3">Used in Groups ({asset.usedInGroups.length})</h2>
              <div className="space-y-2">
                {asset.usedInGroups.map((link) => (
                  <div
                    key={link.linkId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{link.group.name}</div>
                      <div className="text-sm text-gray-600">
                        External ID: {link.group.externalId}
                      </div>
                      {link.altText && (
                        <div className="text-xs text-gray-500">
                          Alt text: {link.altText}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Sort order: {link.sortOrder}
                      </div>
                    </div>
                    <Link
                      href={`/groups/${link.group.externalId}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Group →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Used in Articles */}
          {asset.usedInArticles.length > 0 && (
            <div className="border rounded-lg p-4 bg-white">
              <h2 className="font-semibold mb-3">Used in Articles ({asset.usedInArticles.length})</h2>
              <div className="space-y-2">
                {asset.usedInArticles.map((link) => (
                  <div
                    key={link.linkId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{link.article.title}</div>
                      <div className="text-sm text-gray-600">
                        External ID: {link.article.externalId}
                      </div>
                      {link.altText && (
                        <div className="text-xs text-gray-500">
                          Alt text: {link.altText}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Sort order: {link.sortOrder}
                      </div>
                    </div>
                    <Link
                      href={`/articles/${link.article.externalId}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Article →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Used in Categories */}
          {asset.usedInCategories.length > 0 && (
            <div className="border rounded-lg p-4 bg-white">
              <h2 className="font-semibold mb-3">Used in Categories ({asset.usedInCategories.length})</h2>
              <div className="space-y-2">
                {asset.usedInCategories.map((link) => (
                  <div
                    key={link.linkId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: link.category.color }}
                        />
                        <span className="font-medium">{link.category.name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Type: {link.category.type}
                      </div>
                      {link.altText && (
                        <div className="text-xs text-gray-500">
                          Alt text: {link.altText}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Sort order: {link.sortOrder}
                      </div>
                    </div>
                    <Link
                      href={`/categories/${link.category.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Category →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No Usage Message */}
      {totalUsage === 0 && (
        <div className="border rounded-lg p-8 bg-gray-50 text-center">
          <p className="text-gray-600">This media asset is not currently used anywhere.</p>
          <p className="text-sm text-gray-500 mt-2">
            You can safely delete it if it's no longer needed.
          </p>
        </div>
      )}
    </div>
  );
}
