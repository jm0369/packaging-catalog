export const revalidate = 0;

import { adminFetch } from '@/lib/admin-client';
import { updateCategory, deleteCategory, removeCategoryFromGroup } from '../actions';
import Link from 'next/link';
import { DeleteCategoryButton, RemoveGroupButton } from './delete-buttons';

type Category = {
  id: string;
  name: string;
  color: string;
  groups: Array<{
    id: string;
    externalId: string;
    name: string;
  }>;
};

async function fetchCategory(id: string): Promise<Category | null> {
  const r = await adminFetch(`/admin/categories/${id}`, { cache: 'no-store' });
  if (!r.ok) return null;
  return r.json();
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await fetchCategory(id);

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
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit Category</h1>
        <DeleteCategoryButton onDelete={handleDelete} />
      </div>

      <form action={handleUpdate} className="space-y-4 p-4 border rounded">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={category.name}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium mb-1">
            Color
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              id="color"
              name="color"
              required
              defaultValue={category.color}
              className="border rounded h-10 w-20"
            />
            <span className="text-sm text-gray-600">{category.color}</span>
          </div>
        </div>

        <button type="submit" className="px-4 py-2 rounded bg-black text-white">
          Save Changes
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Assigned Groups ({category.groups.length})</h2>
        {category.groups.length === 0 ? (
          <p className="text-gray-500">This category is not assigned to any groups yet.</p>
        ) : (
          <ul className="space-y-2">
            {category.groups.map((group) => {
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
