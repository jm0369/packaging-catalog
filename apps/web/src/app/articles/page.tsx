import Link from 'next/link';
import { ArticlesTable } from '@/components/articles-table';

export const revalidate = 600;

type Props = {
  searchParams: Promise<{ q?: string; limit?: string; offset?: string }>;
};

const API = process.env.NEXT_PUBLIC_API_BASE!;

type Article = {
  id: string;
  externalId: string;
  title: string;
  description: string | null;
  sku: string | null;
  ean: string | null;
  uom: string | null;
  attributes: Record<string, string> | null;
  media: string[];
  group: {
    id: string;
    externalId: string;
    name: string;
  };
};

async function fetchArticles(params: { q?: string; limit: number; offset: number }) {
  const searchParams = new URLSearchParams();
  if (params.q) searchParams.set('q', params.q);
  searchParams.set('limit', String(params.limit));
  searchParams.set('offset', String(params.offset));

  const r = await fetch(`${API}/api/articles?${searchParams}`, { next: { revalidate } });
  if (!r.ok) return { data: [], total: 0 };
  return r.json() as Promise<{ data: Article[]; total: number }>;
}

export const metadata = {
  title: 'Articles - Catalog',
  description: 'Browse all articles',
};

export default async function ArticlesPage({ searchParams }: Props) {
  const sp = await searchParams;

  const limit = Math.min(100, Math.max(1, Number(sp.limit ?? 24)));
  const offset = Math.max(0, Number(sp.offset ?? 0));
  const q = sp.q?.trim() || undefined;

  const { data, total } = await fetchArticles({ q, limit, offset });

  const prevOffset = Math.max(0, offset - limit);
  const nextOffset = offset + limit;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Articles</h1>
        <p className="text-gray-600 mt-2">Browse all articles in the catalog</p>
      </div>

      {/* Search */}
      <form className="flex gap-2" action="/articles" method="get">
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder="Search articles by title, SKU, or EAN..."
          className="border rounded px-3 py-2 w-full max-w-lg"
        />
        <input type="hidden" name="limit" value={String(limit)} />
        <button className="px-4 py-2 rounded bg-black text-white">Search</button>
      </form>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        {q && (
          <span>
            Search results for <strong>&quot;{q}&quot;</strong> •{' '}
          </span>
        )}
        {total} {total === 1 ? 'article' : 'articles'} found
      </div>

      {/* Articles Table */}
      {data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {q ? 'No articles found matching your search.' : 'No articles available.'}
          </p>
        </div>
      ) : (
        <ArticlesTable articles={data} />
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-gray-600">
          Showing {data.length === 0 ? 0 : offset + 1}–{Math.min(offset + limit, total)} of {total}
        </div>
        <div className="flex gap-2">
          <Link
            className={`px-3 py-2 rounded border ${offset === 0 ? 'pointer-events-none opacity-50' : ''}`}
            href={{ pathname: '/articles', query: { q, limit, offset: prevOffset } }}
          >
            ← Prev
          </Link>
          <Link
            className={`px-3 py-2 rounded border ${nextOffset >= total ? 'pointer-events-none opacity-50' : ''}`}
            href={{ pathname: '/articles', query: { q, limit, offset: nextOffset } }}
          >
            Next →
          </Link>
        </div>
      </div>
    </div>
  );
}
