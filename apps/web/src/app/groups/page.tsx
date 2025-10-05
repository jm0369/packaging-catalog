import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GroupList } from '@/components/group-list';

export const revalidate = 600;

type Search = Promise<{ q?: string; limit?: string; offset?: string; category?: string }> | { q?: string; limit?: string; offset?: string; category?: string };

const API = process.env.NEXT_PUBLIC_API_BASE!;

type Category = {
  id: string;
  name: string;
  color: string;
};

type GroupData = {
  id: string;
  externalId: string;
  name: string;
  description?: string | null;
  media: string[];
  categories: Category[];
};

async function fetchGroups(params: { q?: string; limit?: number; offset?: number; category?: string }) {
  const sp = new URLSearchParams();
  if (params.q) sp.set('q', params.q);
  if (params.category) sp.set('category', params.category);
  sp.set('limit', String(params.limit ?? 24));
  sp.set('offset', String(params.offset ?? 0));
  const r = await fetch(`${API}/api/article-groups?${sp.toString()}`, { next: { revalidate } });
  if (!r.ok) notFound();
  return r.json() as Promise<{ total: number; limit: number; offset: number; data: GroupData[] }>;
}

async function fetchCategories() {
  const r = await fetch(`${API}/api/categories`, { next: { revalidate } });
  if (!r.ok) return [];
  return r.json() as Promise<Category[]>;
}

export default async function HomePage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const q = sp.q?.trim() || undefined;
  const categoryId = sp.category?.trim() || undefined;
  const limit = Math.min(100, Math.max(1, Number(sp.limit ?? 24)));
  const offset = Math.max(0, Number(sp.offset ?? 0));

  const [{ data, total }, categories] = await Promise.all([
    fetchGroups({ q, limit, offset, category: categoryId }),
    fetchCategories(),
  ]);

  const prevOffset = Math.max(0, offset - limit);
  const nextOffset = offset + limit;

  const selectedCategory = categories.find(c => c.id === categoryId);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Article groups</h1>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Link
            href="/groups"
            className={`px-3 py-1 rounded-full border text-sm transition-colors ${
              !categoryId ? 'bg-black text-white border-black' : 'hover:bg-gray-100'
            }`}
          >
            All
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/groups?category=${category.id}`}
              className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                categoryId === category.id
                  ? 'text-white border-current'
                  : 'hover:bg-gray-100'
              }`}
              style={{
                backgroundColor: categoryId === category.id ? category.color : undefined,
                borderColor: category.color,
                color: categoryId === category.id ? 'white' : undefined,
              }}
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      {/* Search */}
      <form className="flex gap-2" action="/" method="get">
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder="Search groups…"
          className="border rounded px-3 py-2 w-full max-w-lg"
        />
        {categoryId && <input type="hidden" name="category" value={categoryId} />}
        <input type="hidden" name="limit" value={String(limit)} />
        <button className="px-3 py-2 rounded bg-black text-white">Search</button>
      </form>

      {selectedCategory && (
        <p className="text-sm text-gray-600">
          Showing groups in category: <strong>{selectedCategory.name}</strong>
        </p>
      )}

      <GroupList groups={data} apiBase={API} />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {data.length === 0 ? 0 : offset + 1}–{Math.min(offset + limit, total)} of {total}
        </div>
        <div className="flex gap-2">
          <Link
            className={`px-3 py-2 rounded border ${offset === 0 ? 'pointer-events-none opacity-50' : ''}`}
            href={{ pathname: '/groups', query: { q, category: categoryId, limit, offset: prevOffset } }}
          >
            ← Prev
          </Link>
          <Link
            className={`px-3 py-2 rounded border ${nextOffset >= total ? 'pointer-events-none opacity-50' : ''}`}
            href={{ pathname: '/groups', query: { q, category: categoryId, limit, offset: nextOffset } }}
          >
            Next →
          </Link>
        </div>
      </div>
    </div>
  );
}