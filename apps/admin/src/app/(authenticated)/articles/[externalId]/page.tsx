export const revalidate = 0;

import { adminFetch } from '@/lib/admin-client';
import { RemoveCategoryButton } from './remove-category-button';
import { revalidatePath } from 'next/cache';

type Params = { params: Promise<{ externalId: string }> };

type Category = {
  id: string;
  name: string;
  color: string;
};

async function getArticle(externalId: string) {
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/admin/articles/${encodeURIComponent(externalId)}`, { 
    cache: 'no-store',
    headers: {
      'x-admin-secret': process.env.ADMIN_SHARED_SECRET!,
    },
  });
  if (!r.ok) return null;
  return r.json();
}

async function getArticleMedia(externalId: string) {
  const r = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_BASE}/api/articles/${encodeURIComponent(externalId)}/media`, { cache: 'no-store' });
  if (!r.ok) return [];
  return r.json();
}

async function getArticleCategories(externalId: string): Promise<Category[]> {
  const r = await adminFetch(`/admin/articles/${encodeURIComponent(externalId)}/categories`, { cache: 'no-store' });
  if (!r.ok) return [];
  const payload = await r.json();
  return Array.isArray(payload?.categories) ? payload.categories : [];
}

async function getAllCategories(): Promise<Category[]> {
  const API = process.env.NEXT_PUBLIC_API_BASE!;
  const r = await fetch(`${API}/api/categories`, { cache: 'no-store' });
  if (!r.ok) return [];
  const data = await r.json();
  // Filter to only show Article type categories
  return Array.isArray(data) ? data.filter((c: Category & { type: string }) => c.type === 'Article') : [];
}

export default async function AdminArticleDetail({ params }: Params) {
  const { externalId } = await params;
  const [a, media, articleCategories, allCategories] = await Promise.all([
    getArticle(externalId),
    getArticleMedia(externalId),
    getArticleCategories(externalId),
    getAllCategories(),
  ]);

  if (!a) return <div className="py-12 text-center">Article not found.</div>;

  const assignedCategoryIds = new Set(articleCategories.map((c) => c.id));
  const availableCategories = allCategories.filter((c) => !assignedCategoryIds.has(c.id));

  async function handleAssignCategory(formData: FormData) {
    'use server';
    const categoryId = formData.get('categoryId') as string;
    if (!categoryId) return;

    await adminFetch(`/admin/articles/${encodeURIComponent(externalId)}/categories`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ categoryId }),
    });
    
    revalidatePath(`/articles/${externalId}`);
  }

  async function handleRemoveCategory(categoryId: string) {
    'use server';
    await adminFetch(`/admin/articles/${encodeURIComponent(externalId)}/categories/${categoryId}`, {
      method: 'DELETE',
    });
    
    revalidatePath(`/articles/${externalId}`);
  }

  async function handleToggleVisibility(formData: FormData) {
    'use server';
    const isVisible = formData.get('isVisible') === 'true';
    
    await adminFetch(`/admin/articles/${encodeURIComponent(externalId)}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ isVisible }),
    });
    
    revalidatePath(`/articles/${externalId}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">
          {a.title} <span className="text-sm text-gray-500">({a.externalId})</span>
        </h1>
        <a className="px-3 py-2 rounded bg-black text-white" href={`/upload?article=${encodeURIComponent(externalId)}`}>Upload new image</a>
      </div>

      {/* Visibility Toggle */}
      <div className="border rounded p-4">
        <h2 className="text-lg font-semibold mb-3">Visibility</h2>
        <form action={handleToggleVisibility} className="flex items-center gap-3">
          <input type="hidden" name="isVisible" value={a.isVisible ? 'false' : 'true'} />
          <div className="flex items-center gap-2">
            <span className="text-sm">Status:</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${a.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              {a.isVisible ? 'Visible in Store' : 'Hidden from Store'}
            </span>
          </div>
          <button 
            type="submit" 
            className={`px-3 py-1.5 rounded text-sm ${a.isVisible ? 'bg-gray-200 hover:bg-gray-300' : 'bg-green-600 hover:bg-green-700 text-white'}`}
          >
            {a.isVisible ? 'Hide from Store' : 'Show in Store'}
          </button>
        </form>
      </div>

      {/* Categories Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {articleCategories.length === 0 ? (
            <p className="text-gray-500 text-sm">No categories assigned.</p>
          ) : (
            articleCategories.map((c) => (
              <RemoveCategoryButton
                key={c.id}
                categoryId={c.id}
                categoryName={c.name}
                categoryColor={c.color}
                onRemove={handleRemoveCategory}
              />
            ))
          )}
        </div>

        {availableCategories.length > 0 ? (
          <form action={handleAssignCategory} className="flex gap-2 items-center">
            <select
              name="categoryId"
              required
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">+ Add category...</option>
              {availableCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button type="submit" className="px-3 py-2 rounded border text-sm">
              Add
            </button>
          </form>
        ) : allCategories.length === 0 ? (
          <p className="text-xs text-gray-500">No Article categories available. Create Article type categories first.</p>
        ) : (
          <p className="text-xs text-gray-500">All available categories have been assigned.</p>
        )}
      </div>

      {/* Media Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Images</h2>
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
    </div>
  );
}