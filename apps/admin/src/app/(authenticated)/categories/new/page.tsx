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
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-semibold">New Category</h1>

      <form action={handleCreate} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
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
            Color
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
              name="color"
              placeholder="#3B82F6"
              className="border rounded px-3 py-2 flex-1"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">Use hex color code (e.g., #3B82F6)</p>
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
