// apps/admin/src/app/groups/[externalId]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { adminFetch } from '@/lib/admin-client';
import { fetchGroup } from '@/lib/admin-api';
import { setGroupActiveAction } from '@/lib/admin-actions';

type GroupMediaItem = {
  id: string;
  mediaId: string;
  altText: string | null;
  sortOrder: number;
  isPrimary?: boolean;
  media?: { key?: string; mime?: string };
  url?: string;
};

type ArticleRow = {
  id: string;
  externalId: string;
  title: string;
  ean: string | null;
  uom: string | null;
  active: boolean;
};

type Paged<T> = { total: number; limit: number; offset: number; data: T[] };

async function getMedia(externalId: string): Promise<GroupMediaItem[]> {
  const res = await adminFetch(`/admin/article-groups/${externalId}/media`);
  if (!res.ok) return [];
  const payload = await res.json();
  const list = Array.isArray(payload?.media) ? payload.media : payload;
  return list as GroupMediaItem[];
}

// Use the public read endpoint (admin header is fine; API ignores it)
async function getGroupArticles(
  externalId: string,
  params: { q?: string; limit?: number; offset?: number },
): Promise<Paged<ArticleRow>> {
  const sp = new URLSearchParams();
  if (params.q) sp.set('q', params.q);
  sp.set('limit', String(params.limit ?? 25));
  sp.set('offset', String(params.offset ?? 0));

  const res = await adminFetch(
    `/api/article-groups/${(externalId)}/articles?${sp.toString()}`,
  );
  if (!res.ok) {
    return { total: 0, limit: params.limit ?? 25, offset: params.offset ?? 0, data: [] };
  }
  return (await res.json()) as Paged<ArticleRow>;
}

export default async function AdminGroupPage({
  params,
  searchParams,
}: {
  params: Promise<{ externalId: string }>;
  searchParams?: Promise<{ q?: string; limit?: string; offset?: string }>;
}) {
  const { externalId } = await params;
  const sp = (await searchParams) ?? {};
  const q = sp.q ?? '';
  const limit = Math.max(1, Math.min(100, Number(sp.limit ?? 25)));
  const offset = Math.max(0, Number(sp.offset ?? 0));

  const [group, media, articles] = await Promise.all([
    fetchGroup(externalId),
    getMedia(externalId),
    getGroupArticles(externalId, { q, limit, offset }),
  ]);

  if (!group) return notFound();

  const prevOffset = Math.max(0, offset - limit);
  const nextOffset = offset + limit < articles.total ? offset + limit : offset;

  return (
    <div className="space-y-8">
      {/* Header + actions */}
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
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Images</h2>
        {media.length === 0 ? (
          <p className="text-gray-500">No images yet.</p>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {media.map((m) => {
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
                  <form
                    action={`/api/groups/${encodeURIComponent(group.externalId)}/media/${m.id}/primary`}
                    method="post"
                  >
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
      </section>

      {/* Articles in this group */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Articles in this group</h2>

        {/* Search */}
        <form className="flex items-center gap-2" action={`/groups/${encodeURIComponent(externalId)}`} method="get">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search title / SKU / EAN…"
            className="border rounded px-3 py-2 w-full max-w-md"
          />
          <input type="hidden" name="limit" value={String(limit)} />
          <input type="hidden" name="offset" value="0" />
          <button className="px-3 py-2 rounded bg-black text-white">Search</button>
        </form>

        {articles.data.length === 0 ? (
          <p className="text-gray-500">No articles found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="px-3 py-2">External ID</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">EAN</th>
                  <th className="px-3 py-2">Unit</th>
                  <th className="px-3 py-2">Active</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.data.map((a) => (
                  <tr key={a.id} className="border-b">
                    <td className="px-3 py-2 font-mono">{a.externalId}</td>
                    <td className="px-3 py-2">{a.title}</td>
                    <td className="px-3 py-2">{a.ean ?? '—'}</td>
                    <td className="px-3 py-2">{a.uom ?? '—'}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${
                          a.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {a.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <Link
                        className="underline"
                        href={`/articles/${encodeURIComponent(a.externalId)}`}
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <Link
            className={`px-3 py-1 rounded border ${offset === 0 ? 'pointer-events-none opacity-50' : ''}`}
            href={`/groups/${encodeURIComponent(externalId)}?q=${encodeURIComponent(q)}&limit=${limit}&offset=${prevOffset}`}
          >
            ← Prev
          </Link>
          <div className="text-sm text-gray-600">
            {offset + 1}–{Math.min(offset + limit, articles.total)} of {articles.total}
          </div>
          <Link
            className={`px-3 py-1 rounded border ${
              offset === nextOffset ? 'pointer-events-none opacity-50' : ''
            }`}
            href={`/groups/${encodeURIComponent(externalId)}?q=${encodeURIComponent(q)}&limit=${limit}&offset=${nextOffset}`}
          >
            Next →
          </Link>
        </div>
      </section>
    </div>
  );
}