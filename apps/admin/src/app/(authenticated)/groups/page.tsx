export const revalidate = 0;

type Search = Promise<{ q?: string; limit?: string; offset?: string }> | { q?: string; limit?: string; offset?: string };

async function fetchGroups(q?: string, limit = 50, offset = 0) {
  const sp = new URLSearchParams();
  if (q) sp.set('q', q);
  sp.set('limit', String(limit));
  sp.set('offset', String(offset));
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/article-groups?${sp.toString()}`, { cache: 'no-store' });
  if (!r.ok) throw new Error('Failed to load');
  return r.json() as Promise<{ total: number; limit: number; offset: number; data: Array<{ id: string; externalId: string; name: string; description?: string | null; media: string[] }> }>;
}

export default async function AdminGroupsPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const limit = Math.min(100, Math.max(1, Number(sp.limit ?? 50)));
  const offset = Math.max(0, Number(sp.offset ?? 0));

  const { data, total } = await fetchGroups(q, limit, offset);

  const prevOffset = Math.max(0, offset - limit);
  const nextOffset = offset + limit;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Groups</h1>
      </div>

      {/* Search */}
      <form className="flex gap-2" action="/groups" method="get">
        <input name="q" defaultValue={q ?? ''} placeholder="Search…" className="border rounded px-3 py-2 w-full max-w-lg" />
        <input type="hidden" name="limit" value={String(limit)} />
        <button className="px-3 py-2 rounded border">Search</button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead><tr className="border-b">
            <th className="px-3 py-2 text-left">Image</th>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">External ID</th>
            <th className="px-3 py-2 text-right">Actions</th>
          </tr></thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={3} className="px-3 py-8 text-center text-gray-500">No groups found.</td></tr>
            ) : data.map((g) => (
              <tr key={g.id} className="border-b">
                <td className="px-3 py-2">
                  {g.media.length > 0 ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.media[0]} alt={g.name} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">—</div>
                  )}
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium">{g.name}</div>
                  {g.description ? <div className="text-xs text-gray-500 line-clamp-1">{g.description}</div> : null}
                </td>
                <td className="px-3 py-2"><code>{g.externalId}</code></td>
                <td className="px-3 py-2 text-right">
                  <a className="underline" href={`/groups/${encodeURIComponent(g.externalId)}`}>Open</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pager */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing {data.length ? offset + 1 : 0}–{Math.min(offset + limit, total)} of {total}</div>
        <div className="flex gap-2">
          <a className={`px-3 py-2 rounded border ${offset === 0 ? 'opacity-50 pointer-events-none' : ''}`} href={`/groups?${new URLSearchParams(Object.entries({ q: q || '', limit: String(limit), offset: String(prevOffset) }).filter(([, v]) => v)).toString()}`}>← Prev</a>
          <a className={`px-3 py-2 rounded border ${nextOffset >= total ? 'opacity-50 pointer-events-none' : ''}`} href={`/groups?${new URLSearchParams(Object.entries({ q: q || '', limit: String(limit), offset: String(nextOffset) }).filter(([, v]) => v)).toString()}`}>Next →</a>
        </div>
      </div>
    </div>
  );
}