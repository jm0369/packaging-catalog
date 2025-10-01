import type { Group } from '@/lib/types';

export function GroupCard({ g }: { g: Group }) {
  return (
    <a href={`/groups/${encodeURIComponent(g.externalId)}`} className="block rounded-lg border hover:shadow-sm overflow-hidden">
      <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center">
        {g.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={g.imageUrl} alt={g.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}
      </div>
      <div className="p-3">
        <div className="font-medium">{g.name}</div>
        {g.description ? <div className="text-sm text-gray-500 line-clamp-2">{g.description}</div> : null}
      </div>
    </a>
  );
}