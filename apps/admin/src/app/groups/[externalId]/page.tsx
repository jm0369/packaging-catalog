// apps/admin/src/app/groups/[externalId]/page.tsx
import Link from 'next/link';
import { adminFetch } from '@/lib/admin-client';
import ReorderList from '@/components/client-dnd-island';

type ApiMediaItem = {
  id: string;                 // linkId
  mediaId: string;            // asset id
  altText: string | null;
  sortOrder: number;
  isPrimary?: boolean;
  media: { id: string; key: string; mime: string; createdAt?: string };
};

type ApiResponse = {
  group: { id: string; externalId: string; name: string };
  media: ApiMediaItem[];
};

const CDN = (process.env.NEXT_PUBLIC_CDN_BASE ?? '').replace(/\/$/, '');
const toUrl = (key: string) => (CDN ? `${CDN}/${key}` : `/${key}`);

async function getGroupMedia(externalId: string) {
  const res = await adminFetch(
    `/admin/article-groups/${externalId}/media`,
    { cache: 'no-store' },
  );
  if (!res.ok) {
    return { group: { id: '', externalId, name: externalId }, media: [] } as ApiResponse;
  }
  const payload = (await res.json()) as ApiResponse;
  payload.media = (payload.media ?? []).map(m => ({ ...m, url: toUrl(m.media.key) })) as (ApiMediaItem & { url: string })[];
  return payload as ApiResponse & { media: (ApiMediaItem & { url: string })[] };
}

export default async function AdminGroupPage({
  params,
}: {
  params: Promise<{ externalId: string }>;
}) {
  const { externalId } = await params;
  const payload = await getGroupMedia(externalId);
  const enc = encodeURIComponent(externalId);

  // Server component renders shell; the DnD is a small client island below:
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Group: {payload.group.name}</h1>
          <div className="text-xs text-gray-500 mt-1">{payload.group.externalId}</div>
        </div>
        <Link className="px-3 py-2 rounded bg-black text-white" href={`/upload?group=${enc}`}>
          Upload new image
        </Link>
      </div>

      <ReorderList externalId={externalId} initialItems={payload.media} />
    </div>
  );
}