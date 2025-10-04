import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GroupList } from '@/components/group-list';

export const revalidate = 600;

type Search = Promise<{ q?: string; limit?: string; offset?: string }> | { q?: string; limit?: string; offset?: string };

const API = process.env.NEXT_PUBLIC_API_BASE!;

async function fetchGroups(params: { q?: string; limit?: number; offset?: number }) {
  const sp = new URLSearchParams();
  if (params.q) sp.set('q', params.q);
  sp.set('limit', String(params.limit ?? 24));
  sp.set('offset', String(params.offset ?? 0));
  const r = await fetch(`${API}/api/article-groups?${sp.toString()}`, { next: { revalidate } });
  if (!r.ok) notFound();
  return r.json() as Promise<{ total: number; limit: number; offset: number; data: Array<{ id: string; externalId: string; name: string; description?: string | null; media: string[] }> }>;
}

export default async function HomePage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const limit = Math.min(100, Math.max(1, Number(sp.limit ?? 24)));
  const offset = Math.max(0, Number(sp.offset ?? 0));

  const { data, total } = await fetchGroups({ q, limit, offset });

  const prevOffset = Math.max(0, offset - limit);
  const nextOffset = offset + limit;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Article groups</h1>

      {/* Search */}
      <form className="flex gap-2" action="/" method="get">
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder="Search groups…"
          className="border rounded px-3 py-2 w-full max-w-lg"
        />
        <input type="hidden" name="limit" value={String(limit)} />
        <button className="px-3 py-2 rounded bg-black text-white">Search</button>
      </form>

      <GroupList groups={data} apiBase={API} />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {data.length === 0 ? 0 : offset + 1}–{Math.min(offset + limit, total)} of {total}
        </div>
        <div className="flex gap-2">
          <Link
            className={`px-3 py-2 rounded border ${offset === 0 ? 'pointer-events-none opacity-50' : ''}`}
            href={{ pathname: '/', query: { q, limit, offset: prevOffset } }}
          >
            ← Prev
          </Link>
          <Link
            className={`px-3 py-2 rounded border ${nextOffset >= total ? 'pointer-events-none opacity-50' : ''}`}
            href={{ pathname: '/', query: { q, limit, offset: nextOffset } }}
          >
            Next →
          </Link>
        </div>
      </div>
    </div>
  );
}