'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AddGroupLink } from '@/components/media/add-group-link';
import { AddArticleLink } from '@/components/media/add-article-link';
import { AddCategoryLink } from '@/components/media/add-category-link';
import { RemoveLinkButton } from '@/components/media/remove-link-button';
import { SetPrimaryButton } from '@/components/media/set-primary-button';

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

function formatBytes(bytes?: number | null): string {
  if (!bytes) return 'Unknown';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function MediaAssetDetailClient({ 
  asset, 
  cdnBase 
}: { 
  asset: MediaAssetDetail; 
  cdnBase: string;
}) {
  const router = useRouter();
  const url = `${cdnBase}/${asset.key}`;
  
  const totalUsage = 
    asset.usedInGroups.length + 
    asset.usedInArticles.length + 
    asset.usedInCategories.length;

  const handleRefresh = () => {
    router.refresh();
  };

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

      {/* Connection Management */}
      <div className="space-y-4">
        {/* Groups Section */}
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Connected Groups ({asset.usedInGroups.length})</h2>
          </div>
          
          <div className="space-y-3">
            {asset.usedInGroups.length > 0 && (
              <div className="space-y-2">
                {asset.usedInGroups.map((link) => (
                  <div
                    key={link.linkId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="font-medium">{link.group.name}</div>
                      <div className="text-sm text-gray-600">
                        External ID: {link.group.externalId}
                      </div>
                      {link.altText && (
                        <div className="text-xs text-gray-500">
                          Alt text: {link.altText}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          Sort order: {link.sortOrder}
                        </span>
                        <SetPrimaryButton
                          linkId={link.linkId}
                          linkType="group"
                          entityId={link.group.externalId}
                          isPrimary={link.sortOrder === 0}
                          onSuccess={handleRefresh}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/groups/${link.group.externalId}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View →
                      </Link>
                      <RemoveLinkButton
                        mediaId={asset.id}
                        linkId={link.linkId}
                        linkType="group"
                        entityName={link.group.name}
                        onSuccess={handleRefresh}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <AddGroupLink mediaId={asset.id} onSuccess={handleRefresh} />
          </div>
        </div>

        {/* Articles Section */}
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Connected Articles ({asset.usedInArticles.length})</h2>
          </div>
          
          <div className="space-y-3">
            {asset.usedInArticles.length > 0 && (
              <div className="space-y-2">
                {asset.usedInArticles.map((link) => (
                  <div
                    key={link.linkId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="font-medium">{link.article.title}</div>
                      <div className="text-sm text-gray-600">
                        External ID: {link.article.externalId}
                      </div>
                      {link.altText && (
                        <div className="text-xs text-gray-500">
                          Alt text: {link.altText}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          Sort order: {link.sortOrder}
                        </span>
                        <SetPrimaryButton
                          linkId={link.linkId}
                          linkType="article"
                          entityId={link.article.externalId}
                          isPrimary={link.sortOrder === 0}
                          onSuccess={handleRefresh}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/articles/${link.article.externalId}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View →
                      </Link>
                      <RemoveLinkButton
                        mediaId={asset.id}
                        linkId={link.linkId}
                        linkType="article"
                        entityName={link.article.title}
                        onSuccess={handleRefresh}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <AddArticleLink mediaId={asset.id} onSuccess={handleRefresh} />
          </div>
        </div>

        {/* Categories Section (Read-only) */}
        {asset.usedInCategories.length > 0 && (
          <div className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Connected Categories ({asset.usedInCategories.length})</h2>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                {asset.usedInCategories.map((link) => (
                  <div
                    key={link.linkId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                  >
                    <div className="space-y-1 flex-1">
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
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          Sort order: {link.sortOrder}
                        </span>
                        <SetPrimaryButton
                          linkId={link.linkId}
                          linkType="category"
                          entityId={link.category.id}
                          isPrimary={link.sortOrder === 0}
                          onSuccess={handleRefresh}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/categories/${link.category.id}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View →
                      </Link>
                      <RemoveLinkButton
                        mediaId={asset.id}
                        linkId={link.linkId}
                        linkType="category"
                        entityName={link.category.name}
                        onSuccess={handleRefresh}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <AddCategoryLink mediaId={asset.id} onSuccess={handleRefresh} />
            </div>
          </div>
        )}

        {/* Add Category section if no categories exist */}
        {asset.usedInCategories.length === 0 && (
          <div className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Connected Categories (0)</h2>
            </div>
            
            <div className="space-y-3">
              <AddCategoryLink mediaId={asset.id} onSuccess={handleRefresh} />
            </div>
          </div>
        )}
      </div>

      {/* No Usage Message */}
      {totalUsage === 0 && (
        <div className="border rounded-lg p-8 bg-gray-50 text-center">
          <p className="text-gray-600">This media asset is not currently used anywhere.</p>
          <p className="text-sm text-gray-500 mt-2">
            Use the forms above to connect it to groups or articles.
          </p>
        </div>
      )}
    </div>
  );
}
