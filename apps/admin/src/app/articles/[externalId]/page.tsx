import Link from 'next/link';
import { adminFetch } from '@/lib/admin-client';
import { MediaSortableGrid } from '@/components/media-sortable';

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

export default async function AdminArticlePage({ params }: { params: Promise<{ externalId: string }> }) {
  const { externalId } = await params;
  const { article, media } = await getArticleMedia(externalId);
  const enc = encodeURIComponent(externalId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Article: {article.title} ({externalId})
        </h1>
        <div className="flex gap-2">
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
          reorderApiPath={`/api/articles/${externalId}/media/reorder`}
          setPrimaryPathBase={`/api/articles/${externalId}/media/`}
          unlinkPathBase={`/api/articles/${externalId}/media/`}
        />
      )}
    </div>
  );
}