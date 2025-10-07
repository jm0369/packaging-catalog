import { createCategory } from '../actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { StringArrayField, ObjectArrayField } from '../array-field';

export default function NewCategoryPage() {
  async function handleCreate(formData: FormData) {
    'use server';
    const result = await createCategory(formData);
    if (result.ok && result.id) {
      redirect(`/categories/${result.id}`);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-xl font-semibold">New Category</h1>

      <form action={handleCreate} className="space-y-6 p-6 border rounded bg-white">
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
              className="border rounded px-3 py-2 w-full"
              placeholder="e.g., Packaging, Labels, Boxes"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1">
              Type *
            </label>
            <select
              id="type"
              name="type"
              required
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">Select type...</option>
              <option value="Article">Article</option>
              <option value="Group">Group</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
                defaultValue="#3B82F6"
                className="border rounded h-10 w-20"
              />
              <input
                type="text"
                placeholder="#3B82F6"
                className="border rounded px-3 py-2 flex-1"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Use hex color code (e.g., #3B82F6)</p>
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
            className="border rounded px-3 py-2 w-full"
            placeholder="Brief description of this category"
          />
        </div>

        <ObjectArrayField
          label="Properties"
          name="properties"
          namePlaceholder="Property name (e.g., Material, Thickness)"
          descriptionPlaceholder="Property description or value"
        />

        <StringArrayField
          label="Applications"
          name="applications"
          placeholder="Application (e.g., Food packaging, Shipping)"
        />

        <StringArrayField
          label="Formats & Specifications"
          name="formatsSpecifications"
          placeholder="Format or specification"
        />

        <ObjectArrayField
          label="Key Figures"
          name="keyFigures"
          namePlaceholder="Key figure name (e.g., Weight, Size)"
          descriptionPlaceholder="Value or description"
        />

        <ObjectArrayField
          label="Ordering"
          name="ordering"
          namePlaceholder="Order option (e.g., Minimum quantity)"
          descriptionPlaceholder="Order description or requirement"
        />

        <StringArrayField
          label="Ordering Notes"
          name="orderingNotes"
          placeholder="Note (e.g., Lead time information)"
        />

        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 rounded bg-black text-white">
            Create Category
          </button>
          <Link href="/categories" className="px-4 py-2 rounded border">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
