// apps/admin/src/app/articles/page.tsx
import Link from 'next/link';
import { adminFetch } from '@/lib/admin-client';

type ArticleRow = {
  id: string;
  externalId: string;
  title: string;
  ean: string | null;
  uom: string | null;
  active: boolean;
};

type Paged<T> = {
  total: number;
  limit: number;
  offset: number;
  data: T[];
};

async function getArticles(params: { q?: string; limit?: number; offset?: number }): Promise<Paged<ArticleRow>> {
  const sp = new URLSearchParams();
  if (params.q) sp.set('q', params.q);
  sp.set('limit', String(params.limit ?? 25));
  sp.set('offset', String(params.offset ?? 0));

  const r = await adminFetch(`/api/articles?${sp.toString()}`);
  if (!r.ok) throw new Error('Failed to load articles');
  const json = await r.json();
  return json as Paged<ArticleRow>;
}

export default async function AdminArticlesIndex({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; limit?: string; offset?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const q = sp.q ?? '';
  const limit = Math.max(1, Math.min(100, Number(sp.limit ?? 25)));
  const offset = Math.max(0, Number(sp.offset ?? 0));

  const { data, total } = await getArticles({ q, limit, offset });

  const prevOffset = Math.max(0, offset - limit);
  const nextOffset = offset + limit < total ? offset + limit : offset;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Articles</h1>
        <Link className="px-3 py-2 rounded border" href="/groups">
          Browse Groups
        </Link>
      </div>

      {/* Search */}
      <form className="flex items-center gap-2" action="/articles" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search title / SKU / EAN…"
          className="border rounded px-3 py-2 w-full max-w-md"
        />
        <input type="hidden" name="limit" value={String(limit)} />
        <button className="px-3 py-2 rounded bg-black text-white">Search</button>
      </form>

      {/* Table */}
      {data.length === 0 ? (
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
              {data.map((a) => (
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
                      className="text-blue-600 underline"
                      href={`/articles/${encodeURIComponent(a.externalId)}`}
                    >
                      Open
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
        <div className="text-sm text-gray-600">
          Showing {data.length === 0 ? 0 : offset + 1}–{Math.min(offset + limit, total)} of {total}
        </div>
        <div className="flex gap-2">
          <Link
            className={`px-3 py-2 rounded border ${offset === 0 ? 'pointer-events-none opacity-50' : ''}`}
            href={{
              pathname: '/articles',
              query: { q, limit, offset: prevOffset },
            }}
          >
            ← Prev
          </Link>
          <Link
            className={`px-3 py-2 rounded border ${offset + limit >= total ? 'pointer-events-none opacity-50' : ''}`}
            href={{
              pathname: '/articles',
              query: { q, limit, offset: nextOffset },
            }}
          >
            Next →
          </Link>
        </div>
      </div>
    </div>
  );
}