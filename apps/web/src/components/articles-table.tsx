import Link from 'next/link';
import Image from 'next/image';

type Article = {
  externalId: string;
  title: string;
  sku?: string | null;
  imageUrl?: string | null;
  media?: string[];
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
};

type ArticlesTableProps = {
  articles: Article[];
};

export function ArticlesTable({ articles }: ArticlesTableProps) {
  if (articles.length === 0) {
    return <p className="text-gray-500">No articles found.</p>;
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Bild</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold" colSpan={2}>Artikel</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold" colSpan={2}>Maße mm</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold" colSpan={3}>Verpackungseinheit (VPE)</th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold" colSpan={2}>Palettierung</th>
          </tr>
          <tr className="bg-gray-50">
            <th className="border border-gray-300 px-4 py-2 text-left text-sm"></th>
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
          {articles.map((article) => {
            const imageUrl = article.imageUrl || (article.media && article.media[0]) || null;
            
            return (
              <tr key={article.externalId} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={imageUrl} 
                      alt={article.title} 
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                      No image
                    </div>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <Link 
                    href={`/articles/${encodeURIComponent(article.externalId)}`}
                    className="underline"
                  >
                    {article.title}
                  </Link>
                </td>
                <td className="border border-gray-300 px-4 py-2">{article.sku || '—'}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {article.attributes?._INNENLAENGE || '—'} × {article.attributes?._INNENBREITE || '—'} × {article.attributes?._INNENHOEHE || '—'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {article.attributes?._AUSSENLAENGE || '—'} × {article.attributes?._AUSSENBREITE || '—'} × {article.attributes?._AUSSENHOEHE || '—'}
                </td>
                <td className="border border-gray-300 px-4 py-2">{article.attributes?._VE2UEBERVERMENGE || '—'}</td>
                <td className="border border-gray-300 px-4 py-2">{article.attributes?._VE2UEBERVERPART || '—'}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {article.attributes?._VE2UEBERVERPLAENGE || '—'} × {article.attributes?._VE2UEBERVERPBREITE || '—'} × {article.attributes?._VE2UEBERVERPHOEHE || '—'}
                </td>
                <td className="border border-gray-300 px-4 py-2">{article.attributes?._VE3VERPACKUNGMENGE || '—'}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {article.attributes?._VE3PALETTENLAENGE || '—'} × {article.attributes?._VE3PALETTENBREITE || '—'} × {article.attributes?._VE3PALETTENHOEHE || '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
