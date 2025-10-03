// apps/admin/src/app/articles/[externalId]/page.tsx
import Link from 'next/link';
import { adminFetch } from '@/lib/admin-client';
import { MediaSortableGrid } from '@/components/media-sortable';
import { ArticleActiveToggle } from '@/components/article-active-toggle';

type LinkItem = {
  id: string;
  mediaId: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
  url: string | null;
};

async function getArticleMedia(externalId: string): Promise<{
  article: { id: string; externalId: string; title: string };
  media: LinkItem[];
}> {
  const r = await adminFetch(`/admin/articles/${encodeURIComponent(externalId)}/media`);
  if (!r.ok) throw new Error('Failed to load');
  return r.json();
}

async function getArticleDetail(externalId: string): Promise<{
  id: string;
  externalId: string;
  title: string;
  active: boolean;
}> {
  // Public read API is fine; admin header will be ignored if present
  const r = await adminFetch(`/api/articles/${encodeURIComponent(externalId)}`);
  if (!r.ok) throw new Error('Failed to load article');
  // API returns the article object directly
  const a = await r.json();
  return {
    id: a.id,
    externalId: a.externalId,
    title: a.title,
    active: Boolean(a.active),
  };
}

export default async function AdminArticlePage({
  params,
}: { params: Promise<{ externalId: string }> }) {
  const { externalId } = await params;
  const [{ article, media }, detail] = await Promise.all([
    getArticleMedia(externalId),
    getArticleDetail(externalId),
  ]);
  const enc = encodeURIComponent(externalId);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">
          Article: {article.title} ({externalId})
        </h1>

        <div className="flex items-center gap-4">
          {/* ✅ Active toggle */}
          <ArticleActiveToggle
            externalId={detail.externalId}
            initialActive={detail.active}
          />

          <Link className="px-3 py-2 rounded bg-black text-white" href={`/upload?article=${enc}`}>
            Upload new image
          </Link>
          <Link className="px-3 py-2 rounded border" href="/articles">Back</Link>
        </div>
      </div>

      {media.length === 0 ? (
        <p className="text-gray-500">No images yet.</p>
      ) : (
        <MediaSortableGrid
          externalId={externalId}
          initial={media}
          reorderApiPath={`/api/articles/${enc}/media/reorder`}
          setPrimaryPathBase={`/api/articles/${enc}/media/`}
          unlinkPathBase={`/api/articles/${enc}/media/`}
        />
      )}
    </div>
  );
}