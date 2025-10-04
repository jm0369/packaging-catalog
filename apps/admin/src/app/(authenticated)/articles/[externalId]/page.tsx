export const revalidate = 0;

type Params = { params: Promise<{ externalId: string }> };

async function getArticle(externalId: string) {
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/articles/${encodeURIComponent(externalId)}`, { cache: 'no-store' });
  if (!r.ok) return null;
  return r.json();
}
async function getArticleMedia(externalId: string) {
  const r = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_BASE}/api/articles/${encodeURIComponent(externalId)}/media`, { cache: 'no-store' });
  if (!r.ok) return [];
  return r.json();
}

export default async function AdminArticleDetail({ params }: Params) {
  const { externalId } = await params;
  const [a, media] = await Promise.all([getArticle(externalId), getArticleMedia(externalId)]);
  if (!a) return <div className="py-12 text-center">Article not found.</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">
          {a.title} <span className="text-sm text-gray-500">({a.externalId})</span>
        </h1>
        <a className="px-3 py-2 rounded bg-black text-white" href={`/upload?article=${encodeURIComponent(externalId)}`}>Upload new image</a>
      </div>

      {media.media.length === 0 ? (
        <p className="text-gray-500">No images yet.</p>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {media.media.map((m: { id: string; url?: string; media?: { key: string }; altText?: string; sortOrder: number; isPrimary: boolean }) => {
            const url = m.url ?? (m.media?.key && process.env.NEXT_PUBLIC_CDN_BASE ? `${process.env.NEXT_PUBLIC_CDN_BASE}/${m.media.key}` : null);
            return (
              <li key={m.id} className="border rounded p-3 space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {url ? <img src={url} alt={m.altText ?? ''} className="w-full h-32 object-cover rounded" /> : <div className="w-full h-32 bg-gray-100 rounded" />}
                <div className="text-xs text-gray-600 flex justify-between">
                  <span>sort: {m.sortOrder}</span>
                  {m.isPrimary ? <span className="text-green-600">Primary</span> : null}
                </div>
                <form action={`/api/articles/${(externalId)}/media/${m.id}/primary`} method="post">
                  <button className="text-sm underline">Set as primary</button>
                </form>
                <form action={`/api/articles/${(externalId)}/media/${m.id}`} method="post">
                  <input type="hidden" name="_method" value="DELETE" />
                  <button className="text-sm text-red-600 underline">Unlink</button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}