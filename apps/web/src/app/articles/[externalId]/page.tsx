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
      <h1>{a.title}</h1>
      {a.description ? <p>{a.description}</p> : <p className="text-gray-500">No description.</p>}
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
      <p className="text-sm text-gray-500">Updated: {a.updatedAt ? new Date(a.updatedAt).toLocaleString() : '—'}</p>
    </article>
  );
}