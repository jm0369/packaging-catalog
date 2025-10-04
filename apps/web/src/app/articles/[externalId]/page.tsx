import { notFound } from 'next/navigation';
import { ImageGallery } from '@/components/image-gallery';

export const revalidate = 600;

type Params = { params: Promise<{ externalId: string }> };

const API = process.env.NEXT_PUBLIC_API_BASE!;

async function fetchArticle(externalId: string) {
  const r = await fetch(`${API}/api/articles/${encodeURIComponent(externalId)}`, { next: { revalidate } });
  if (r.status === 404) return null;
  if (!r.ok) notFound();
  return r.json();
}

export async function generateMetadata({ params }: Params) {
  const { externalId } = await params;
  const a = await fetchArticle(externalId);
  if (!a) return { title: 'Article not found' };
  return { title: a.title, description: a.description ?? undefined };
}

export default async function ArticlePage({ params }: Params) {
  const { externalId } = await params;
  const a = await fetchArticle(externalId);
  if (!a) return notFound();

  return (
    <article className="prose">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{a.title}</h1>
      {a.description ? (
        <p className="text-lg text-gray-700 leading-relaxed mb-6">{a.description}</p>
      ) : (
        <p className="text-lg text-gray-400 italic mb-6">No description.</p>
      )}
      <strong>Group:</strong>{' '}
      <a href={`/groups/${encodeURIComponent(a.group.externalId)}`} className="underline">
        {a.group.name ?? a.group.externalId}
      </a>

      <ImageGallery images={a.media || []} alt={a.title} />

      {/* Article Information Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold" colSpan={2}>Artikel</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold" colSpan={2}>Maße mm</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold" colSpan={3}>Verpackungseinheit (VPE)</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold" colSpan={2}>Palettierung</th>
            </tr>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">Titel</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">SKU</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">Innen</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">Außen</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">Menge</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">Art</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">VPE mm</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">Menge</th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm">Außenmaß mm</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">{a.title}</td>
              <td className="border border-gray-300 px-4 py-2">{a.sku || '—'}</td>
              <td className="border border-gray-300 px-4 py-2">
                {a.attributes?._INNENLAENGE || '—'} × {a.attributes?._INNENBREITE || '—'} × {a.attributes?._INNENHOEHE || '—'}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {a.attributes?._AUSSENLAENGE || '—'} × {a.attributes?._AUSSENBREITE || '—'} × {a.attributes?._AUSSENHOEHE || '—'}
              </td>
              <td className="border border-gray-300 px-4 py-2">{a.attributes?._VE2UEBERVERMENGE || '—'}</td>
              <td className="border border-gray-300 px-4 py-2">{a.attributes?._VE2UEBERVERPART || '—'}</td>
              <td className="border border-gray-300 px-4 py-2">
                {a.attributes?._VE2UEBERVERPLAENGE || '—'} × {a.attributes?._VE2UEBERVERPBREITE || '—'} × {a.attributes?._VE2UEBERVERPHOEHE || '—'}
              </td>
              <td className="border border-gray-300 px-4 py-2">{a.attributes?._VE3VERPACKUNGMENGE || '—'}</td>
              <td className="border border-gray-300 px-4 py-2">
                {a.attributes?._VE3PALETTENLAENGE || '—'} × {a.attributes?._VE3PALETTENBREITE || '—'} × {a.attributes?._VE3PALETTENHOEHE || '—'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-500 mt-8">Updated: {a.updatedAt ? new Date(a.updatedAt).toLocaleString() : '—'}</p>
    </article>
  );
}