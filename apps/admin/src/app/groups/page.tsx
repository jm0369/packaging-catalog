// apps/admin/src/app/groups/page.tsx
import Link from 'next/link';
import { fetchGroups } from '@/lib/admin-api';

type Search = {
  q?: string;
  limit?: string;
  offset?: string;
};

type Paged<T> = {
  total: number;
  limit: number;
  offset: number;
  data: T[];
};

export const revalidate = 0; // always fresh in admin

export default async function AdminGroupsIndex({
  searchParams,
}: {
  searchParams?: Promise<Search> | Search;
}) {
  const sp = (await searchParams) ?? {};
  const q = sp.q?.trim() ?? '';
  const limit = Math.max(1, Math.min(100, Number(sp.limit ?? 25)));
  const offset = Math.max(0, Number(sp.offset ?? 0));

  const { data, total } = await fetchGroups({ q, limit, offset });

  const prevOffset = Math.max(0, offset - limit);
  const nextOffset = offset + limit < total ? offset + limit : offset;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Groups</h1>
      </div>

      {/* Search */}
      <form className="flex items-center gap-2" action="/groups" method="get">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search name / description…"
          className="border rounded px-3 py-2 w-full max-w-md"
        />
        <input type="hidden" name="limit" value={String(limit)} />
        <button className="px-3 py-2 rounded bg-black text-white">Search</button>
      </form>

      {/* Table */}
      {data.length === 0 ? (
        <p className="text-gray-500">No groups found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="px-3 py-2">External ID</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Description</th>
                <th className="px-3 py-2">Active</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((g) => (
                <tr key={g.id} className="border-b">
                  <td className="px-3 py-2 font-mono">{g.externalId}</td>
                  <td className="px-3 py-2">{g.name}</td>
                  <td className="px-3 py-2 text-gray-600">
                    {g.description ?? '—'}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${
                        g.active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {g.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <Link
                      className="text-blue-600 underline"
                      href={`/groups/${encodeURIComponent(g.externalId)}`}
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
        <div className="text-sm text-gray-600">
          Showing {data.length === 0 ? 0 : offset + 1}–{Math.min(offset + limit, total)} of {total}
        </div>
        <div className="flex gap-2">
          <Link
            className={`px-3 py-2 rounded border ${offset === 0 ? 'pointer-events-none opacity-50' : ''}`}
            href={{
              pathname: '/groups',
              query: { q, limit, offset: prevOffset },
            }}
          >
            ← Prev
          </Link>
          <Link
            className={`px-3 py-2 rounded border ${offset + limit >= total ? 'pointer-events-none opacity-50' : ''}`}
            href={{
              pathname: '/groups',
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