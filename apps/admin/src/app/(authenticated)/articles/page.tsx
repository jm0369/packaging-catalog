export const revalidate = 0;

type Search = Promise<{ q?: string; limit?: string; offset?: string }> | { q?: string; limit?: string; offset?: string };
type ArticleRow = { 
  id: string; 
  externalId: string; 
  title: string; 
  ean: string | null; 
  uom: string | null; 
  media: string[]; 
  articleGroup?: { externalId: string; name?: string };
  categories: Array<{ id: string; name: string; color: string }>;
};

async function getArticles(q?: string, limit = 25, offset = 0) {
  const sp = new URLSearchParams();
  if (q) sp.set('q', q);
  sp.set('limit', String(limit));
  sp.set('offset', String(offset));
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/articles?${sp.toString()}`, { cache: 'no-store' });
  if (!r.ok) throw new Error('Failed to load');
  return r.json() as Promise<{ total: number; limit: number; offset: number; data: ArticleRow[] }>;
}

export default async function AdminArticles({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const limit = Math.min(100, Math.max(1, Number(sp.limit ?? 25)));
  const offset = Math.max(0, Number(sp.offset ?? 0));

  const { data, total } = await getArticles(q, limit, offset);

  const prevOffset = Math.max(0, offset - limit);
  const nextOffset = offset + limit;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Articles</h1>
      </div>

      <form className="flex gap-2" action="/articles" method="get">
        <input name="q" defaultValue={q ?? ''} placeholder="Search title / SKU / EAN…" className="border rounded px-3 py-2 w-full max-w-lg" />
        <input type="hidden" name="limit" value={String(limit)} />
        <button className="px-3 py-2 rounded border">Search</button>
      </form>

      {data.length === 0 ? (
        <p className="text-gray-500">No articles found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="border-b">
              <th className="px-3 py-2 text-left">Image</th>
              <th className="px-3 py-2 text-left">External ID</th>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Group</th>
              <th className="px-3 py-2 text-left">Categories</th>
              <th className="px-3 py-2 text-left">EAN</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr></thead>
            <tbody>
              {data.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="px-3 py-2">
                  {a.media.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={a.media[0]} alt={a.title} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">—</div>
                  )}
                </td>
                  <td className="px-3 py-2 font-mono">{a.externalId}</td>
                  <td className="px-3 py-2">{a.title}</td>
                  <td className="px-3 py-2">
                    {a.articleGroup?.externalId ? (
                      <a className="underline" href={`/groups/${encodeURIComponent(a.articleGroup.externalId)}`}>
                        {a.articleGroup?.name ?? a.articleGroup.externalId}
                      </a>
                    ) : '—'}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {a.categories?.map((c) => (
                        <span
                          key={c.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border"
                          style={{ borderColor: c.color }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: c.color }}
                          />
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2">{a.ean ?? '—'}</td>
                  <td className="px-3 py-2 text-right">
                    <a className="underline" href={`/articles/${encodeURIComponent(a.externalId)}`}>Open</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing {data.length ? offset + 1 : 0}–{Math.min(offset + limit, total)} of {total}</div>
        <div className="flex gap-2">
          <a className={`px-3 py-2 rounded border ${offset === 0 ? 'pointer-events-none opacity-50' : ''}`} href={`/articles?${new URLSearchParams({ ...(q && { q }), limit: String(limit), offset: String(prevOffset) }).toString()}`}>← Prev</a>
          <a className={`px-3 py-2 rounded border ${nextOffset >= total ? 'pointer-events-none opacity-50' : ''}`} href={`/articles?${new URLSearchParams({ ...(q && { q }), limit: String(limit), offset: String(nextOffset) }).toString()}`}>Next →</a>
        </div>
      </div>
    </div>
  );
}