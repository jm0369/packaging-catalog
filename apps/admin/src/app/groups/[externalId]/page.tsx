import Link from 'next/link';
import { notFound } from 'next/navigation';
import { adminFetch } from '@/lib/admin-client';
import { fetchGroup } from '@/lib/admin-api';
import { setGroupActiveAction } from '@/lib/admin-actions';

async function getMedia(externalId: string) {
  const res = await adminFetch(`/admin/article-groups/${(externalId)}/media`);
  if (!res.ok) return [];
  // Expected API shape: { group: {...}, media: [...] } — we only need media array here
  const payload = await res.json();
  const list = Array.isArray(payload?.media) ? payload.media : payload;
  return list as Array<{
    id: string;
    mediaId: string;
    altText: string | null;
    sortOrder: number;
    isPrimary?: boolean;
    media?: { key?: string; mime?: string };
    url?: string; // your API may already provide url
  }>;
}

export default async function AdminGroupPage({
  params,
}: {
  params: Promise<{ externalId: string }>;
}) {
  const { externalId } = await params;

  const [group, media] = await Promise.all([
    fetchGroup(externalId),
    getMedia(externalId),
  ]);

  if (!group) return notFound();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">{group.name}</h1>
          <span
            className={[
              'text-xs rounded px-1.5 py-0.5',
              group.active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700',
            ].join(' ')}
          >
            {group.active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle Active/Inactive */}
          <form action={setGroupActiveAction}>
            <input type="hidden" name="externalId" value={group.externalId} />
            {/* Submit the next desired state */}
            <input type="hidden" name="active" value={String(!group.active)} />
            <button
              type="submit"
              aria-pressed={group.active}
              aria-label={group.active ? 'Deactivate group' : 'Activate group'}
              title={group.active ? 'Deactivate group' : 'Activate group'}
              className={[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                group.active ? 'bg-green-600' : 'bg-gray-300',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black',
              ].join(' ')}
            >
              <span
                className={[
                  'inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow',
                  group.active ? 'translate-x-5' : 'translate-x-1',
                ].join(' ')}
              />
            </button>
          </form>

          <Link
            className="px-3 py-2 rounded bg-black text-white"
            href={`/upload?group=${encodeURIComponent(group.externalId)}`}
          >
            Upload new image
          </Link>
        </div>
      </div>

      {/* Images */}
      {media.length === 0 ? (
        <p className="text-gray-500">No images yet.</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {media.map((m) => {
            // Prefer pre-built URL from API, else derive via PUBLIC_CDN_BASE/key
            const url =
              m.url ??
              (m.media?.key && process.env.NEXT_PUBLIC_CDN_BASE
                ? `${process.env.NEXT_PUBLIC_CDN_BASE}/${m.media.key}`
                : undefined);

            return (
              <li key={m.id} className="border rounded p-3 space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {url ? (
                  <img src={url} alt={m.altText ?? ''} className="w-full h-32 object-cover rounded" />
                ) : (
                  <div className="w-full h-32 bg-gray-100 rounded" />
                )}
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>sort: {m.sortOrder}</span>
                  {m.isPrimary ? <span className="text-green-700">Primary</span> : null}
                </div>

                {/* Set primary */}
                <form action={`/api/groups/${encodeURIComponent(group.externalId)}/media/${m.id}/primary`} method="post">
                  <button className="text-sm underline">Set as primary</button>
                </form>

                {/* Unlink */}
                <form action={`/api/groups/${encodeURIComponent(group.externalId)}/media/${m.id}`} method="post">
                  <input type="hidden" name="_method" value="DELETE" />
                  <button className="text-sm text-red-600 underline">Unlink</button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}