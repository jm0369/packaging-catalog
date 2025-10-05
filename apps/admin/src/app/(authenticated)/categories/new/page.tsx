import { createCategory } from '../actions';
import { redirect } from 'next/navigation';
import Link from 'next/link';

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

        <div>
          <label htmlFor="properties" className="block text-sm font-medium mb-1">
            Properties <span className="text-xs text-gray-500">(JSON array of objects with name and description)</span>
          </label>
          <textarea
            id="properties"
            name="properties"
            rows={4}
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
            className="border rounded px-3 py-2 w-full font-mono text-sm"
            placeholder='["Note 1", "Note 2"]'
          />
        </div>

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
