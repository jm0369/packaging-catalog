'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type MediaItem = {
  id: string;          // link id
  mediaId: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
  media: {
    id: string;
    key: string;
    mime: string;
    sizeBytes: number | null;
    width?: number | null;
    height?: number | null;
    createdAt: string;
    url: string | null;
  } | null;
};

export function MediaPickerModal({
  externalId,
  onClose,
  onPick, // (mediaId) => void
}: {
  externalId: string;
  onClose: () => void;
  onPick: (mediaId: string) => Promise<void> | void;
}) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<MediaItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/admin/groups/${encodeURIComponent(externalId)}/media`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const json = await res.json();
        if (!aborted) setRows(json.media ?? []);
      } catch (e) {
        if (!aborted) setError((e as Error).message);
      } finally {
        if (!aborted) setLoading(false);
      }
    })();
    return () => { aborted = true; };
  }, [externalId]);

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full">
        <div className="p-4 border-b flex items-center justify-between">
          <button
            className="text-sm px-3 py-1 rounded bg-emerald-600 text-white"
            onClick={() => {
              window.location.href = `/upload?group=${encodeURIComponent(externalId)}`;
            }}
          >
            Upload new image
          </button>
          <h3 className="font-semibold">Select primary image for {externalId}</h3>
          <button className="text-sm text-gray-600 hover:underline" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-sm text-gray-600">Loading…</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : rows.length === 0 ? (
            <div className="text-sm text-gray-600">No media linked yet.</div>
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {rows.map((r) => (
                <li key={r.id} className="border rounded p-2">
                  {r.media?.url ? (
                    <Image
                      src={r.media.url}
                      alt={r.altText ?? r.media.key}
                      width={300}
                      height={128}
                      className="w-full h-32 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 rounded" />
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-600">
                      {r.isPrimary ? 'Primary' : 'Linked'}
                    </span>
                    <button
                      className="text-xs px-2 py-1 rounded bg-blue-600 text-white"
                      onClick={() => onPick(r.mediaId)}
                    >
                      Make primary
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}