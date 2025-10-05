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

async function getGroup(externalId: string) {
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/article-groups/${(externalId)}`, { cache: 'no-store' });
  if (!r.ok) return null;
  return r.json();
}

async function getMedia(externalId: string) {
  const r = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_BASE}/api/groups/${encodeURIComponent(externalId)}/media`, { cache: 'no-store' });
  if (!r.ok) return [];
  const payload = await r.json();
  return Array.isArray(payload?.media) ? payload.media : payload;
}

async function getGroupCategories(externalId: string): Promise<Category[]> {
  const r = await adminFetch(`/admin/article-groups/${(externalId)}/categories`, { cache: 'no-store' });
  if (!r.ok) return [];
  const payload = await r.json();
  return Array.isArray(payload?.categories) ? payload.categories : [];
}

async function getAllCategories(): Promise<Category[]> {
  const r = await adminFetch('/admin/categories', { cache: 'no-store' });
  if (!r.ok) return [];
  return r.json();
}

export default async function AdminGroupDetail({ params }: Params) {
  const { externalId } = await params;
  const [group, media, groupCategories, allCategories] = await Promise.all([
    getGroup(externalId),
    getMedia(externalId),
    getGroupCategories(externalId),
    getAllCategories(),
  ]);

  if (!group) {
    return <div className="py-12 text-center">Group not found.</div>;
  }

  const assignedCategoryIds = new Set(groupCategories.map((c) => c.id));
  const availableCategories = allCategories.filter((c) => !assignedCategoryIds.has(c.id));

  async function handleAssignCategory(formData: FormData) {
    'use server';
    const categoryId = formData.get('categoryId') as string;
    if (!categoryId) return;

    await adminFetch(`/admin/article-groups/${(externalId)}/categories`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ categoryId }),
    });

    revalidatePath(`/groups/${externalId}`);
  }

  async function handleRemoveCategory(categoryId: string) {
    'use server';
    await adminFetch(`/admin/article-groups/${(externalId)}/categories/${categoryId}`, {
      method: 'DELETE',
    });

    revalidatePath(`/groups/${externalId}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className='flex flex-col gap-1'>
          <h1 className="text-xl font-semibold">{group.name}</h1>
          <p className='text-sm text-gray-500'>{group.description}</p>
        </div>
        <a className="px-3 py-2 rounded bg-black text-white" href={`/upload?group=${(externalId)}`}>Upload new image</a>
      </div>

      {/* Categories Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {groupCategories.length === 0 ? (
            <p className="text-gray-500 text-sm">No categories assigned.</p>
          ) : (
            groupCategories.map((c) => (
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
          <p className="text-xs text-gray-500">No categories available. Create categories first.</p>
        ) : (
          <p className="text-xs text-gray-500">All available categories have been assigned.</p>
        )}
      </div>

      {/* Media Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Images</h2>
        {media.length === 0 ? (
          <p className="text-gray-500">No images yet.</p>
        ) : (
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {media.map((m: { id: string; url?: string; media?: { key: string }; altText?: string; sortOrder: number; isPrimary: boolean }) => {
              const url = m.url ?? (m.media?.key && process.env.NEXT_PUBLIC_CDN_BASE ? `${process.env.NEXT_PUBLIC_CDN_BASE}/${m.media.key}` : null);
              return (
                <li key={m.id} className="border rounded p-3 space-y-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {url ? <img src={url} alt={m.altText ?? ''} className="w-full h-32 object-cover rounded" /> : <div className="w-full h-32 bg-gray-100 rounded" />}
                  <div className="text-xs text-gray-600 flex justify-between">
                    <span>sort: {m.sortOrder}</span>
                    {m.isPrimary ? <span className="text-green-600">Primary</span> : null}
                  </div>
                  <form action={`/api/groups/${(externalId)}/media/${m.id}/primary`} method="post">
                    <button className="text-sm underline">Set as primary</button>
                  </form>
                  <form action={`/api/groups/${(externalId)}/media/${m.id}`} method="post">
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