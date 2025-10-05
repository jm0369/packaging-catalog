import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ImageGallery } from '@/components/image-gallery';

export const revalidate = 600;

type Props = {
  params: Promise<{ id: string }>;
};

const API = process.env.NEXT_PUBLIC_API_BASE!;

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
  media: string[];
  groupCount: number;
};

async function fetchCategory(id: string): Promise<Category | null> {
  const r = await fetch(`${API}/api/categories`, { next: { revalidate } });
  if (!r.ok) return null;
  const categories = await r.json();
  const category = categories.find((c: Category) => c.id === id);
  return category || null;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const category = await fetchCategory(id);
  if (!category) return { title: 'Category not found' };
  return { 
    title: category.name, 
    description: category.description ?? `Browse ${category.name} products` 
  };
}

export default async function CategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await fetchCategory(id);
  
  if (!category) return notFound();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg border-2"
            style={{ backgroundColor: category.color }}
          />
          <h1 className="text-4xl font-bold text-gray-900">{category.name}</h1>
        </div>
        
        {category.description && (
          <p className="text-lg text-gray-700 leading-relaxed">
            {category.description}
          </p>
        )}

        <div className="text-sm text-gray-600">
          {category.groupCount} {category.groupCount === 1 ? 'group' : 'groups'}
        </div>
      </div>

      {/* Media Gallery */}
      {category.media && category.media.length > 0 && (
        <div className="space-y-3">
          <ImageGallery images={category.media} alt={category.name} />
        </div>
      )}

      {/* Properties */}
      {category.properties && category.properties.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">Properties</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {category.properties.map((prop, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-white">
                <h3 className="font-semibold text-gray-900 mb-1">{prop.name}</h3>
                <p className="text-gray-600 text-sm">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applications */}
      {category.applications && category.applications.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">Applications</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {category.applications.map((app, idx) => (
              <li key={idx}>{app}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Formats & Specifications */}
      {category.formatsSpecifications && category.formatsSpecifications.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">Formats & Specifications</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {category.formatsSpecifications.map((format, idx) => (
              <li key={idx}>{format}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Figures */}
      {category.keyFigures && category.keyFigures.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">Key Figures</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {category.keyFigures.map((figure, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-white">
                <h3 className="font-semibold text-gray-900 mb-1">{figure.name}</h3>
                <p className="text-gray-600 text-sm">{figure.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ordering */}
      {category.ordering && category.ordering.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">Ordering Information</h2>
          <div className="space-y-3">
            {category.ordering.map((order, idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-white">
                <h3 className="font-semibold text-gray-900 mb-1">{order.name}</h3>
                <p className="text-gray-600 text-sm">{order.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ordering Notes */}
      {category.orderingNotes && category.orderingNotes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">Ordering Notes</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {category.orderingNotes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Back to Home */}
      <div className="pt-8 border-t">
        <Link 
          href={`/groups?category=${id}`}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          ← View all {category.name} products
        </Link>
      </div>
    </div>
  );
}
