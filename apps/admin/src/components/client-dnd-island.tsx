// ---- client DnD island ----
'use client';

type ApiMediaItem = {
  id: string;                 // linkId
  mediaId: string;            // asset id
  altText: string | null;
  sortOrder: number;
  isPrimary?: boolean;
  media: { id: string; key: string; mime: string; createdAt?: string };
};


import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

type Item = ApiMediaItem & { url: string };

export default function ReorderList({ externalId, initialItems }: { externalId: string; initialItems: Item[] }) {
  const [items, setItems] = useState<Item[]>([...initialItems].sort((a,b)=>a.sortOrder-b.sortOrder));
  const dragIndex = useRef<number | null>(null);
  const router = useRouter();

  function onDragStart(idx: number) {
    dragIndex.current = idx;
  }
  function onDragOver(e: React.DragEvent<HTMLLIElement>) {
    e.preventDefault();
  }
  function onDrop(idx: number) {
    if (dragIndex.current === null) return;
    const from = dragIndex.current;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(idx, 0, moved);
    setItems(next.map((it, i) => ({ ...it, sortOrder: i })));
    dragIndex.current = null;
  }

  async function saveOrder() {
    const order = items.map(it => it.id); // link IDs in desired order
    const res = await fetch(`/api/groups/${externalId}/media/reorder`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ order }),
    });
    if (!res.ok) {
      const t = await res.text();
      alert(`Failed to save order: ${res.status}\n${t}`);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-gray-500">No images yet.</p>
      ) : (
        <>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((m, idx) => (
              <li
                key={m.id}
                className="border rounded p-3 space-y-2 bg-white"
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={onDragOver}
                onDrop={() => onDrop(idx)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.altText ?? ''} className="w-full h-32 object-cover rounded" />
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>sort: {m.sortOrder}</span>
                  {idx === 0 ? (
                    <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700">Primary</span>
                  ) : null}
                </div>
                <div className="flex items-center gap-3">
                  {idx !== 0 ? (
                    <form action={`/api/groups/${externalId}/media/${m.id}/primary`} method="post">
                      <button className="text-sm underline" type="submit">Set as primary</button>
                    </form>
                  ) : (
                    <span className="text-sm text-gray-400">Already primary</span>
                  )}
                  <form action={`/api/groups/${externalId}/media/${m.id}`} method="post">
                    <input type="hidden" name="_method" value="DELETE" />
                    <button className="text-sm text-red-600 underline" type="submit">Unlink</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <button onClick={saveOrder} className="px-3 py-2 rounded bg-black text-white">
              Save order
            </button>
            <button onClick={() => setItems([...initialItems].sort((a,b)=>a.sortOrder-b.sortOrder))} className="px-3 py-2 rounded bg-gray-100">
              Reset
            </button>
          </div>
          <p className="text-xs text-gray-500">
            Tip: drag tiles to reorder. The first item becomes the primary image (shown in public).
          </p>
        </>
      )}
    </div>
  );
}