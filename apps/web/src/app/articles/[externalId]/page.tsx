// apps/web/src/app/articles/[externalId]/page.tsx
import { fetchArticle } from '@/lib/api';
import { notFound } from 'next/navigation';

export const revalidate = 600;

// Next 15+ requires awaiting params where used in generateMetadata,
// if you use generateMetadata here, keep the await pattern you already applied.

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ externalId: string }>;
}) {
  const { externalId } = await params;
  const a = await fetchArticle(externalId);
  console.log('ArticlePage', { externalId, a });
  if (!a) return notFound();

  return (
    <article className="prose max-w-3xl">
      <h1>{a.title}</h1>

      {/* ---- Images Carousel (very light) ---- */}
      {a.images?.length ? (
        <div className="space-y-2">
          {/* Main image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={a.images[0].url ?? ''}
            alt={a.images[0].altText ?? a.title}
            className="w-full max-h-[480px] object-contain rounded border"
          />

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto py-1">
            {a.images.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.id}
                src={img.url ?? ''}
                alt={img.altText ?? a.title}
                className="h-20 w-28 object-cover rounded border flex-none"
                
              />
            ))}
          </div>
        </div>
      ) : null}

      {/* ---- Details ---- */}
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