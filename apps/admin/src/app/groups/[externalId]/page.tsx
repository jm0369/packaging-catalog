import Link from 'next/link';
import { adminFetch } from '@/lib/admin-client';
import { MediaSortableGrid, type MediaItem } from '@/components/media-sortable';

type ApiMediaLink = {
  id: string;           // link id
  mediaId: string;      // asset id
  altText: string | null;
  sortOrder: number;
  isPrimary?: boolean;
  media?: { key?: string } | null; // from backend
};

async function getGroupMedia(externalId: string): Promise<{
  group: { id: string; externalId: string; name: string };
  media: ApiMediaLink[];
}> {
  const r = await adminFetch(`/admin/article-groups/${(externalId)}/media`);
  if (!r.ok) throw new Error('Failed to load group media');
  return r.json();
}

export default async function AdminGroupPage({
  params,
}: {
  params: Promise<{ externalId: string }>;
}) {
  const { externalId } = await params;
  const { group, media } = await getGroupMedia(externalId);

  // Build absolute CDN URLs if backend only returns `media.key`
  const CDN = process.env.NEXT_PUBLIC_CDN_BASE || '';
  const items: MediaItem[] = media.map((m) => ({
    id: m.id,
    url: m.media?.key ? `${CDN}/${m.media.key}` : null,
    altText: m.altText ?? null,
    sortOrder: m.sortOrder ?? 0,
    isPrimary: Boolean(m.isPrimary),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Group: {group.name} ({group.externalId})
        </h1>
        <Link className="px-3 py-2 rounded bg-black text-white" href={`/upload?group=${externalId}`}>
          Upload new image
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">No images yet.</p>
      ) : (
        <MediaSortableGrid
          externalId={group.externalId}
          initial={items}
          reorderApiPath={`/api/groups/${externalId}/media/reorder`}
          setPrimaryPathBase={`/api/groups/${externalId}/media/`}
          unlinkPathBase={`/api/groups/${externalId}/media/`}
        />
      )}
    </div>
  );
}