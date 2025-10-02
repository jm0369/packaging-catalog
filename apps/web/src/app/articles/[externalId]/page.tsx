import { fetchArticle } from '@/lib/api';
import { notFound } from 'next/navigation';
import ArticleCarousel from '@/components/article-carousel';

export const revalidate = 600;

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ externalId: string }>;
}) {
  const { externalId } = await params;
  const a = await fetchArticle(externalId);
  if (!a) return notFound();

  return (
    <article className="prose max-w-3xl">
      <h1>{a.title}</h1>

      {a.images?.length ? (
        <ArticleCarousel
          title={a.title}
          images={a.images.map((m) => ({
            id: m.id,
            url: m.url,               // already CDN-absolute from API
            altText: m.altText ?? a.title,
            sortOrder: m.sortOrder ?? 0,
            width: m.width ?? null,
            height: m.height ?? null,
          }))}
          className="mb-4"
        />
      ) : null}

      {a.description ? <p>{a.description}</p> : <p className="text-gray-500">No description.</p>}

      <ul>
        {a.sku && (
          <li>
            <strong>SKU:</strong> {a.sku}
          </li>
        )}
        {a.ean && (
          <li>
            <strong>EAN:</strong> {a.ean}
          </li>
        )}
        {a.uom && (
          <li>
            <strong>Unit:</strong> {a.uom}
          </li>
        )}
      </ul>

      {a.group ? (
        <p className="text-sm text-gray-500">
          Group:{' '}
          <a href={`/groups/${encodeURIComponent(a.group.externalId)}`} className="underline">
            {a.group.name}
          </a>
        </p>
      ) : null}

      {a.updatedAt ? (
        <p className="text-xs text-gray-400">Updated: {new Date(a.updatedAt).toLocaleString()}</p>
      ) : null}
    </article>
  );
}