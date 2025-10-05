import Link from 'next/link';

export const revalidate = 600;

const API = process.env.NEXT_PUBLIC_API_BASE!;

type Category = {
  id: string;
  name: string;
  color: string;
  description?: string;
  groupCount: number;
  media: string[];
};

async function fetchCategories(): Promise<Category[]> {
  const r = await fetch(`${API}/api/categories`, { next: { revalidate } });
  if (!r.ok) return [];
  return r.json();
}

export const metadata = {
  title: 'Categories - Catalog',
  description: 'Browse our product categories',
};

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-600 mt-2">Explore our product categories</p>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500">No categories available.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const firstImage = category.media?.[0];
            const imageUrl = firstImage || null;

            return (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
              >
                {/* Image */}
                {imageUrl ? (
                  <div className="aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                ) : (
                  <div 
                    className="aspect-video w-full flex items-center justify-center"
                    style={{ backgroundColor: category.color + '20' }}
                  >
                    <div 
                      className="w-16 h-16 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-gray-700">
                      {category.name}
                    </h2>
                  </div>
                  
                  {category.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    {category.groupCount} {category.groupCount === 1 ? 'group' : 'groups'}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
