import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ImageGallery } from '@/components/image-gallery';
import { ArticlesTable } from '@/components/articles-table';

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
  return r.json() as Promise<{
    total: number;
    limit: number;
    offset: number;
    data: Array<{
      id: string;
      externalId: string;
      title: string;
      description: string | null;
      uom: string | null;
      ean: string | null;
      media: string[];
      sku?: string | null;
      attributes?: {
        _INNENLAENGE?: string;
        _INNENBREITE?: string;
        _INNENHOEHE?: string;
        _AUSSENLAENGE?: string;
        _AUSSENBREITE?: string;
        _AUSSENHOEHE?: string;
        _VE2UEBERVERMENGE?: string;
        _VE2UEBERVERPART?: string;
        _VE2UEBERVERPLAENGE?: string;
        _VE2UEBERVERPBREITE?: string;
        _VE2UEBERVERPHOEHE?: string;
        _VE3VERPACKUNGMENGE?: string;
        _VE3PALETTENLAENGE?: string;
        _VE3PALETTENBREITE?: string;
        _VE3PALETTENHOEHE?: string;
      } | null;
    }>
  }>;
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
      <h1 className="text-2xl font-semibold">{decodeURIComponent(externalId)}</h1>
      <p className="text-sm text-gray-500 mt-1">
        {group.name}
      </p>
      <ImageGallery images={group.media || []} alt={group.name} />
      {/* Search */}
      <form className="flex gap-2 mb-8" action={`/groups/${(externalId)}`} method="get">
        <input
          name="q"
          defaultValue={q ?? ''}
          placeholder="Search articles…"
          className="border rounded px-3 py-2 w-full max-w-lg"
        />
        <input type="hidden" name="limit" value={String(limit)} />
        <button className="px-3 py-2 rounded bg-black text-white">Search</button>
      </form>

      <ArticlesTable articles={data} />

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