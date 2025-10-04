import { notFound } from 'next/navigation';
import { ImageGallery } from '@/components/image-gallery';
import { ArticlesTable } from '@/components/articles-table';

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

      <ImageGallery images={a.media || []} alt={a.title}/>

      <div className='mb-8'></div>

      <ArticlesTable articles={[a]}/>

      <p className="text-sm text-gray-500 mt-8">Updated: {a.updatedAt ? new Date(a.updatedAt).toLocaleString() : '—'}</p>
    </article>
  );
}