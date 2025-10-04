import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 600;

type Props = {
  params: Promise<{ externalId: string }>;
  searchParams: Promise<{ q?: string; limit?: string; offset?: string }>;
};

const API = process.env.NEXT_PUBLIC_API_BASE!;

async function fetchGroup(externalId: string) {
  const r = await fetch(`${API}/api/article-groups/${(externalId)}`, { next: { revalidate } });
  if (r.status === 404) return null;
  if (!r.ok) notFound();
  return r.json();
}

async function fetchGroupArticles(externalId: string, q?: string, limit = 24, offset = 0) {
  const sp = new URLSearchParams();
  if (q) sp.set('q', q);
  sp.set('limit', String(limit));
  sp.set('offset', String(offset));
  sp.set('group', decodeURIComponent(externalId));
  const r = await fetch(`${API}/api/articles?${sp.toString()}`, { next: { revalidate } });
  if (!r.ok) notFound();
  return r.json() as Promise<{ total: number; limit: number; offset: number; data: Array<{ id: string; externalId: string; title: string; description: string | null; uom: string | null; ean: string | null; imageUrl: string; }> }>;
}

export async function generateMetadata({ params }: { params: Props['params'] }) {
  const { externalId } = await params;
  const group = await fetchGroup(externalId);
  if (!group) return { title: 'Group not found' };
  return { title: group.name, description: group.description ?? undefined };
}

export default async function GroupPage({ params, searchParams }: Props) {
  const { externalId } = await params;
  const sp = await searchParams;

  const limit = Math.min(100, Math.max(1, Number(sp.limit ?? 24)));
  const offset = Math.max(0, Number(sp.offset ?? 0));
  const q = sp.q?.trim() || undefined;

  const group = await fetchGroup(externalId);
  if (!group) return notFound();

  const { data, total } = await fetchGroupArticles(externalId, q, limit, offset);

  const prevOffset = Math.max(0, offset - limit);
  const nextOffset = offset + limit;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{group.name}</h1>
      {group.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={group.imageUrl} alt={group.name} className="w-full max-h-72 object-cover rounded" />
      ) : null}

      {/* Search */}
      <form className="flex gap-2" action={`/groups/${encodeURIComponent(externalId)}`} method="get">
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder="Search articles…"
          className="border rounded px-3 py-2 w-full max-w-lg"
        />
        <input type="hidden" name="limit" value={String(limit)} />
        <button className="px-3 py-2 rounded bg-black text-white">Search</button>
      </form>

      {data.length === 0 ? (
        <p className="text-gray-500">No articles found.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.map((a) => (
            <li key={a.id} className="border rounded p-3 hover:shadow-sm">
              <a href={`/articles/${encodeURIComponent(a.externalId)}`}>
                {a.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.imageUrl} alt={a.title} className="w-full h-48 object-cover rounded mb-3" />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded mb-3 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
                <div className="font-medium">{a.title}</div>
                {a.description ? <div className="text-sm text-gray-600 line-clamp-2">{a.description}</div> : null}
                <div className="text-xs text-gray-500 mt-2">{a.uom ?? ''} {a.ean ? `• EAN ${a.ean}` : ''}</div>
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {data.length === 0 ? 0 : offset + 1}–{Math.min(offset + limit, total)} of {total}
        </div>
        <div className="flex gap-2">
          <Link
            className={`px-3 py-2 rounded border ${offset === 0 ? 'pointer-events-none opacity-50' : ''}`}
            href={{ pathname: `/groups/${externalId}`, query: { q, limit, offset: prevOffset } }}
          >
            ← Prev
          </Link>
          <Link
            className={`px-3 py-2 rounded border ${nextOffset >= total ? 'pointer-events-none opacity-50' : ''}`}
            href={{ pathname: `/groups/${externalId}`, query: { q, limit, offset: nextOffset } }}
          >
            Next →
          </Link>
        </div>
      </div>
    </div>
  );
}