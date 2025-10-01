import { fetchGroup, fetchGroupArticles } from '@/lib/api';
import { notFound } from 'next/navigation';
import { SearchBar } from '@/components/search-bar';
import { Pagination } from '@/components/pagination';

export const revalidate = 600;

// ✅ Make props typed as Promises and await them
type Props = {
  params: Promise<{ externalId: string }>;
  searchParams: Promise<{ q?: string; limit?: string; offset?: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ externalId: string }> }) {
  const { externalId } = await params;         // <-- await
  const group = await fetchGroup(externalId);
  if (!group) return { title: 'Group not found' };
  return { title: group.name, description: group.description ?? undefined };
}

export default async function GroupPage({ params, searchParams }: Props) {
  const { externalId } = await params;         // <-- await
  const sp = await searchParams;               // <-- await

  const limit = Number(sp.limit ?? 24);
  const offset = Number(sp.offset ?? 0);
  const q = sp.q;

  const group = await fetchGroup(externalId);
  if (!group) return notFound();

  const { data, total } = await fetchGroupArticles(externalId, { q, limit, offset });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">{group.name}</h1>
      {group.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={group.imageUrl} alt={group.name} className="w-full max-h-72 object-cover rounded mb-4" />
      )}
      <SearchBar placeholder="Search articles…" />
      {data.length === 0 ? (
        <div className="text-gray-500">No articles found.</div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {data.map((a) => (
            <li key={a.id} className="border rounded p-3 hover:shadow-sm">
              <a href={`/articles/${encodeURIComponent(a.externalId)}`}>
                <div className="font-medium">{a.title}</div>
                {a.description ? <div className="text-sm text-gray-600 line-clamp-2">{a.description}</div> : null}
                <div className="text-xs text-gray-500 mt-2">{a.uom ?? ''} {a.ean ? `• EAN ${a.ean}` : ''}</div>
              </a>
            </li>
          ))}
        </ul>
      )}
      <Pagination total={total} limit={limit} offset={offset} />
    </div>
  );
}