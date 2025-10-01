// src/app/page.tsx
import { fetchGroups } from '@/lib/api';
import { SearchBar } from '@/components/search-bar';
import { Pagination } from '@/components/pagination';
import Image from 'next/image';

export const revalidate = 600;

// match your Group page typing style (promises)
type Props = {
  searchParams: Promise<{ q?: string; limit?: string; offset?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
  const sp = await searchParams; // <-- await like your group page
  const limit = Number(sp.limit ?? 24);
  const offset = Number(sp.offset ?? 0);
  const q = sp.q;

  const { data, total } = await fetchGroups({ q, limit, offset });

  return (
    <main className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Article groups</h1>

      <SearchBar placeholder="Search groups…" />

      {data.length === 0 ? (
        <div className="text-gray-500">
          {q ? `No groups found for “${q}”.` : 'No groups yet.'}
        </div>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {data.map((g) => (
            <li key={g.id} className="border rounded p-3 hover:shadow-sm">
              <a href={`/groups/${encodeURIComponent(g.externalId)}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {g.imageUrl ? (
                  <Image
                    src={g.imageUrl}
                    alt={g.name}
                    width={600}
                    height={400}
                    className="w-full h-28 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="w-full h-28 bg-gray-100 rounded mb-2" />
                )}
                <div className="text-sm font-medium line-clamp-2">{g.name}</div>
              </a>
            </li>
          ))}
        </ul>
      )}

      <Pagination total={total} limit={limit} offset={offset} />
    </main>
  );
}