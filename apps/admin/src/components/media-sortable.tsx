'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export type MediaItem = {
  id: string;
  url: string | null;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

type Props = {
  externalId: string;                 // article externalId (display only)
  initial: MediaItem[];               // sorted or not, we’ll normalize
  reorderApiPath: string;             // e.g. /api/articles/104031/media/reorder
  setPrimaryPathBase: string;         // e.g. /api/articles/104031/media/
  unlinkPathBase: string;             // e.g. /api/articles/104031/media/
  // final setPrimary POST => `${setPrimaryPathBase}${linkId}/primary`
  // final unlink   POST => `${unlinkPathBase}${linkId}` with _method=DELETE
};

export function MediaSortableGrid({
  externalId,
  initial,
  reorderApiPath,
  setPrimaryPathBase,
  unlinkPathBase,
}: Props) {
  const router = useRouter();
  const [items, setItems] = React.useState<MediaItem[]>(
    () => [...initial].sort((a, b) => a.sortOrder - b.sortOrder),
  );

  const dragFrom = React.useRef<number | null>(null);

  function onDragStart(index: number) {
    dragFrom.current = index;
  }
  function onDragOver(e: React.DragEvent<HTMLLIElement>) {
    e.preventDefault(); // allow drop
  }
  function onDrop(toIndex: number) {
    const fromIndex = dragFrom.current;
    dragFrom.current = null;
    if (fromIndex == null || fromIndex === toIndex) return;

    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next.map((it, i) => ({ ...it, sortOrder: i }));
    });
  }

  async function saveReorder() {
    const order = items.map((it) => it.id);
    const form = new FormData();
    order.forEach((id) => form.append('ids[]', id));

    const res = await fetch(reorderApiPath, { method: 'POST', body: form });
    if (!res.ok) {
      console.error('Reorder failed', await safeText(res));
      alert('Reorder failed');
      return;
    }
    router.refresh();
  }

  async function setPrimary(linkId: string) {
    const res = await fetch(`${setPrimaryPathBase}${encodeURIComponent(linkId)}/primary`, {
      method: 'POST',
    });
    if (!res.ok) {
      console.error('Set primary failed', await safeText(res));
      alert('Set primary failed');
      return;
    }
    router.refresh();
  }

  async function unlink(linkId: string) {
    const form = new FormData();
    form.append('_method', 'DELETE');
    const res = await fetch(`${unlinkPathBase}${encodeURIComponent(linkId)}`, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) {
      console.error('Unlink failed', await safeText(res));
      alert('Unlink failed');
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-3">
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
            {m.url ? (
              <img
                src={m.url}
                alt={m.altText ?? ''}
                className={`w-full h-32 object-cover rounded ${m.isPrimary ? 'ring-2 ring-blue-600' : ''}`}
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 rounded" />
            )}
            <div className="text-xs text-gray-500">
              sort: {m.sortOrder}{m.isPrimary ? ' • primary' : ''}
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={() => setPrimary(m.id)} className="text-sm underline">
                Set primary
              </button>
              <button type="button" onClick={() => unlink(m.id)} className="text-sm text-red-600 underline">
                Unlink
              </button>
              <span className="ml-auto text-xs text-gray-400 cursor-move select-none" title="Drag to reorder">
                ⠿ Drag
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex gap-3">
        <button type="button" onClick={saveReorder} className="px-3 py-2 rounded border">
          Save order
        </button>
      </div>
    </div>
  );
}

async function safeText(res: Response) {
  try { return await res.text(); } catch { return ''; }
}