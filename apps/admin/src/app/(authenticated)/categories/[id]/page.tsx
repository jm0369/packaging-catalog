export const revalidate = 0;

import { adminFetch } from '@/lib/admin-client';
import { updateCategory, deleteCategory, removeCategoryFromGroup } from '../actions';
import Link from 'next/link';
import Image from 'next/image';
import { DeleteCategoryButton, RemoveGroupButton } from './delete-buttons';

type Category = {
  id: string;
  name: string;
  color: string;
  description?: string;
  properties?: Array<{ name: string; description: string }>;
  applications?: string[];
  formatsSpecifications?: string[];
  keyFigures?: Array<{ name: string; description: string }>;
  ordering?: Array<{ name: string; description: string }>;
  orderingNotes?: string[];
  groups: Array<{
    id: string;
    externalId: string;
    name: string;
  }>;
  media: Array<{
    id: string;
    key: string;
    mime: string;
    width?: number;
    height?: number;
    variants?: Record<string, unknown>;
    altText?: string;
    sortOrder: number;
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
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit Category</h1>
        <DeleteCategoryButton onDelete={handleDelete} />
      </div>

      <form action={handleUpdate} className="space-y-6 p-6 border rounded bg-white">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name *
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
              Color *
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
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={category.description || ''}
            className="border rounded px-3 py-2 w-full"
            placeholder="Brief description of this category"
          />
        </div>

        <div>
          <label htmlFor="properties" className="block text-sm font-medium mb-1">
            Properties <span className="text-xs text-gray-500">(JSON array of objects with name and description)</span>
          </label>
          <textarea
            id="properties"
            name="properties"
            rows={4}
            defaultValue={category.properties ? JSON.stringify(category.properties, null, 2) : ''}
            className="border rounded px-3 py-2 w-full font-mono text-sm"
            placeholder='[{"name": "Property name", "description": "Property description"}]'
          />
        </div>

        <div>
          <label htmlFor="applications" className="block text-sm font-medium mb-1">
            Applications <span className="text-xs text-gray-500">(JSON array of strings)</span>
          </label>
          <textarea
            id="applications"
            name="applications"
            rows={3}
            defaultValue={category.applications ? JSON.stringify(category.applications, null, 2) : ''}
            className="border rounded px-3 py-2 w-full font-mono text-sm"
            placeholder='["Application 1", "Application 2"]'
          />
        </div>

        <div>
          <label htmlFor="formatsSpecifications" className="block text-sm font-medium mb-1">
            Formats & Specifications <span className="text-xs text-gray-500">(JSON array of strings)</span>
          </label>
          <textarea
            id="formatsSpecifications"
            name="formatsSpecifications"
            rows={3}
            defaultValue={category.formatsSpecifications ? JSON.stringify(category.formatsSpecifications, null, 2) : ''}
            className="border rounded px-3 py-2 w-full font-mono text-sm"
            placeholder='["Format 1", "Format 2"]'
          />
        </div>

        <div>
          <label htmlFor="keyFigures" className="block text-sm font-medium mb-1">
            Key Figures <span className="text-xs text-gray-500">(JSON array of objects with name and description)</span>
          </label>
          <textarea
            id="keyFigures"
            name="keyFigures"
            rows={4}
            defaultValue={category.keyFigures ? JSON.stringify(category.keyFigures, null, 2) : ''}
            className="border rounded px-3 py-2 w-full font-mono text-sm"
            placeholder='[{"name": "Key figure name", "description": "Value or description"}]'
          />
        </div>

        <div>
          <label htmlFor="ordering" className="block text-sm font-medium mb-1">
            Ordering <span className="text-xs text-gray-500">(JSON array of objects with name and description)</span>
          </label>
          <textarea
            id="ordering"
            name="ordering"
            rows={4}
            defaultValue={category.ordering ? JSON.stringify(category.ordering, null, 2) : ''}
            className="border rounded px-3 py-2 w-full font-mono text-sm"
            placeholder='[{"name": "Order option", "description": "Order description"}]'
          />
        </div>

        <div>
          <label htmlFor="orderingNotes" className="block text-sm font-medium mb-1">
            Ordering Notes <span className="text-xs text-gray-500">(JSON array of strings)</span>
          </label>
          <textarea
            id="orderingNotes"
            name="orderingNotes"
            rows={3}
            defaultValue={category.orderingNotes ? JSON.stringify(category.orderingNotes, null, 2) : ''}
            className="border rounded px-3 py-2 w-full font-mono text-sm"
            placeholder='["Note 1", "Note 2"]'
          />
        </div>

        <button type="submit" className="px-4 py-2 rounded bg-black text-white">
          Save Changes
        </button>
      </form>

      <div className="space-y-3 p-6 border rounded bg-white">
        <h2 className="text-lg font-semibold">Media Gallery ({category.media.length})</h2>
        {category.media.length === 0 ? (
          <p className="text-gray-500">No media attached yet.</p>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {category.media.map((img) => (
              <div key={img.id} className="border rounded overflow-hidden">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE}/admin/media/${img.key}`}
                  alt={img.altText || ''}
                  width={img.width || 400}
                  height={img.height || 300}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2 text-xs text-gray-600">
                  {img.altText || 'No alt text'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3 p-6 border rounded bg-white">
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
