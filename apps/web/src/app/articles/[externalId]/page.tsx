import { notFound } from 'next/navigation';

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
      
      {a.media && a.media.length > 0 && (
        <div className="not-prose my-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {a.media.map((url: string, idx: number) => (
              <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={url} 
                  alt={`${a.title} - Image ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      <ul>
        {a.sku && <li><strong>SKU:</strong> {a.sku}</li>}
        {a.ean && <li><strong>EAN:</strong> {a.ean}</li>}
        {a.uom && <li><strong>Unit:</strong> {a.uom}</li>}
        {a.group?.externalId && (
          <li>
            <strong>Group:</strong>{' '}
            <a href={`/groups/${encodeURIComponent(a.group.externalId)}`} className="underline">
              {a.group.name ?? a.group.externalId}
            </a>
          </li>
        )}
      </ul>

      {/* Specifications Section */}
      {a.attributes && (
        <div className="mt-8 space-y-6">
          <h2>Spezifikationen</h2>
          
          {/* Maße mm */}
          {(a.attributes._INNENLAENGE || a.attributes._INNENBREITE || a.attributes._INNENHOEHE ||
            a.attributes._AUSSENLAENGE || a.attributes._AUSSENBREITE || a.attributes._AUSSENHOEHE) && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Maße mm:</h3>
              <ul className="list-none pl-0">
                {(a.attributes._INNENLAENGE || a.attributes._INNENBREITE || a.attributes._INNENHOEHE) && (
                  <li>
                    <strong>Innen:</strong> {a.attributes._INNENLAENGE || '—'} × {a.attributes._INNENBREITE || '—'} × {a.attributes._INNENHOEHE || '—'}
                  </li>
                )}
                {(a.attributes._AUSSENLAENGE || a.attributes._AUSSENBREITE || a.attributes._AUSSENHOEHE) && (
                  <li>
                    <strong>Außen:</strong> {a.attributes._AUSSENLAENGE || '—'} × {a.attributes._AUSSENBREITE || '—'} × {a.attributes._AUSSENHOEHE || '—'}
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Verpackungseinheit (VPE) */}
          {(a.attributes._VE2UEBERVERMENGE || a.attributes._VE2UEBERVERPART ||
            a.attributes._VE2UEBERVERPLAENGE || a.attributes._VE2UEBERVERPBREITE || a.attributes._VE2UEBERVERPHOEHE) && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Verpackungseinheit (VPE):</h3>
              <ul className="list-none pl-0">
                {a.attributes._VE2UEBERVERMENGE && (
                  <li><strong>Menge:</strong> {a.attributes._VE2UEBERVERMENGE}</li>
                )}
                {a.attributes._VE2UEBERVERPART && (
                  <li><strong>Art:</strong> {a.attributes._VE2UEBERVERPART}</li>
                )}
                {(a.attributes._VE2UEBERVERPLAENGE || a.attributes._VE2UEBERVERPBREITE || a.attributes._VE2UEBERVERPHOEHE) && (
                  <li>
                    <strong>VPE mm:</strong> {a.attributes._VE2UEBERVERPLAENGE || '—'} × {a.attributes._VE2UEBERVERPBREITE || '—'} × {a.attributes._VE2UEBERVERPHOEHE || '—'}
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Palettierung */}
          {(a.attributes._VE3VERPACKUNGMENGE ||
            a.attributes._VE3PALETTENLAENGE || a.attributes._VE3PALETTENBREITE || a.attributes._VE3PALETTENHOEHE) && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Palettierung:</h3>
              <ul className="list-none pl-0">
                {a.attributes._VE3VERPACKUNGMENGE && (
                  <li><strong>Menge:</strong> {a.attributes._VE3VERPACKUNGMENGE}</li>
                )}
                {(a.attributes._VE3PALETTENLAENGE || a.attributes._VE3PALETTENBREITE || a.attributes._VE3PALETTENHOEHE) && (
                  <li>
                    <strong>Außenmaß mm:</strong> {a.attributes._VE3PALETTENLAENGE || '—'} × {a.attributes._VE3PALETTENBREITE || '—'} × {a.attributes._VE3PALETTENHOEHE || '—'}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      <p className="text-sm text-gray-500 mt-8">Updated: {a.updatedAt ? new Date(a.updatedAt).toLocaleString() : '—'}</p>
    </article>
  );
}