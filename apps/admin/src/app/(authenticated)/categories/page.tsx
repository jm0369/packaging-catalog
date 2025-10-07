export const revalidate = 0;

import Link from 'next/link';

type Category = {
  id: string;
  name: string;
  type: 'Article' | 'Group';
  color: string;
  description?: string;
  groupCount: number;
};

async function fetchCategories(): Promise<Category[]> {
  const API = process.env.NEXT_PUBLIC_API_BASE!;
  const r = await fetch(`${API}/api/categories`, { cache: 'no-store' });
  if (!r.ok) throw new Error('Failed to load categories');
  return r.json();
}

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Categories</h1>
        <Link href="/categories/new" className="px-3 py-2 rounded bg-black text-white">
          + New Category
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-3 py-2 text-left">Color</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="px-3 py-2 text-left">Groups</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-gray-500">
                  No categories yet.
                </td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id} className="border-b">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: c.color }}
                      />
                      <code className="text-xs">{c.color}</code>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="font-medium">{c.name}</div>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      c.type === 'Article' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {c.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 max-w-md">
                    <div className="text-sm text-gray-600 truncate">
                      {c.description || <span className="text-gray-400 italic">No description</span>}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className="text-gray-600">{c.groupCount} groups</span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link className="underline" href={`/categories/${c.id}`}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
