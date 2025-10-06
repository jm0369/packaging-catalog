export const revalidate = 0;

import { updateCategory, deleteCategory, removeCategoryFromGroup } from '../actions';
import Link from 'next/link';
import { DeleteCategoryButton, RemoveGroupButton } from './delete-buttons';
import { CategoryForm } from './category-form';

async function getCategory(id: string) {
  const r = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/categories/${(id)}`, { cache: 'no-store' });
  if (!r.ok) return null;
  return r.json();
}

async function getMedia(id: string) {
  const r = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_BASE}/api/categories/${id}/media`, { cache: 'no-store' });
  if (!r.ok) return [];
  const payload = await r.json();
  return Array.isArray(payload?.media) ? payload.media : payload;
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [category, media] = await Promise.all([getCategory(id), getMedia(id)]);
  console.log(category);
  console.log(media);

  if (!category) {
    return <div className="py-12 text-center">Category not found.</div>;
  }

  async function handleUpdate(formData: FormData) {
    'use server';
    await updateCategory(id, formData);
  }

  async function handleDelete() {
    'use server';
    await deleteCategory(id);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit Category</h1>
        <DeleteCategoryButton onDelete={handleDelete} />
      </div>

      <CategoryForm category={category} onSubmit={handleUpdate} />

      <div className="space-y-3 p-6 border rounded bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Media Gallery ({category.media.length})</h2>
          <Link 
            href={`/upload?category=${id}`}
            className="px-3 py-2 rounded bg-black text-white text-sm"
          >
            + Upload Image
          </Link>
        </div>
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
                <form action={`/api/categories/${(id)}/media/${m.id}/primary`} method="post">
                  <button className="text-sm underline">Set as primary</button>
                </form>
                <form action={`/api/categories/${(id)}/media/${m.id}`} method="post">
                  <input type="hidden" name="_method" value="DELETE" />
                  <button className="text-sm text-red-600 underline">Unlink</button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
      </div>

      <div className="space-y-3 p-6 border rounded bg-white">
        <h2 className="text-lg font-semibold">Assigned Groups ({category.groups.length})</h2>
        {category.groups.length === 0 ? (
          <p className="text-gray-500">This category is not assigned to any groups yet.</p>
        ) : (
          <ul className="space-y-2">
            {category.groups.map((group: { id: string; externalId: string; name: string }) => {
              const boundRemove = async () => {
                'use server';
                await removeCategoryFromGroup(id, group.id);
              };
              
              return (
                <li key={group.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <Link href={`/groups/${group.externalId}`} className="font-medium underline">
                      {group.name}
                    </Link>
                    <div className="text-xs text-gray-500">{group.externalId}</div>
                  </div>
                  <RemoveGroupButton
                    groupName={group.name}
                    onRemove={boundRemove}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
