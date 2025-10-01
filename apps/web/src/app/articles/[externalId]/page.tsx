// src/app/articles/[externalId]/page.tsx
import { fetchArticle } from '@/lib/api';
import { notFound } from 'next/navigation';

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ externalId: string }>;
}) {
  const { externalId } = await params;
  const a = await fetchArticle(externalId);
  if (!a) return { title: 'Article not found' };
  return { title: a.title, description: a.description ?? undefined };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ externalId: string }>;
}) {
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
        {a.group?.externalId && <li><strong>Group:</strong> {a.group.externalId}</li>}
      </ul>
      <p className="text-sm text-gray-500">Updated: {new Date(a.updatedAt).toLocaleString()}</p>
    </article>
  );
}