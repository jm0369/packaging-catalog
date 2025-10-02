import { fetchGroupsPage } from '@/lib/api';
import { setPrimaryImage } from './actions';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams?: { q?: string; limit?: string; offset?: string };
};

export default async function GroupsPage({ searchParams }: Props) {
  const q = searchParams?.q ?? '';
  const limit = Math.min(100, Math.max(1, Number(searchParams?.limit ?? 25)));
  const offset = Math.max(0, Number(searchParams?.offset ?? 0));

  const { data, total } = await fetchGroupsPage({ q, limit, offset });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Groups (Admin)</h1>

      <form method="GET" className="mb-4 flex items-center gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search groups…"
          className="border rounded px-3 py-2 w-64"
        />
        <button className="px-3 py-2 rounded bg-black text-white">Search</button>
      </form>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2 w-[120px]">Image</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2 w-[280px]">External ID</th>
              <th className="text-left p-2 w-[360px]">Set Primary (mediaId)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((g) => (
              <tr key={g.id} className="border-t">
                <td className="p-2 align-top">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {g.imageUrl ? (
                    <img
                      src={g.imageUrl}
                      alt={g.name}
                      className="h-20 w-28 object-cover rounded border"
                    />
                  ) : (
                    <div className="h-20 w-28 bg-gray-100 rounded border" />
                  )}
                </td>
                <td className="p-2 align-top">
                  <div className="font-medium">{g.name}</div>
                  {g.description ? (
                    <div className="text-gray-600 text-xs line-clamp-2">
                      {g.description}
                    </div>
                  ) : null}
                </td>
                <td className="p-2 align-top">
                  <code className="text-xs">{g.externalId}</code>
                </td>
                <td className="p-2 align-top">
                  <InlineSetPrimaryForm externalId={g.externalId} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pager total={total} limit={limit} offset={offset} q={q} />
    </div>
  );
}

function InlineSetPrimaryForm({ externalId }: { externalId: string }) {
  return (
    <form
      action={async (formData: FormData) => {
        'use server';
        const mediaId = String(formData.get('mediaId') ?? '');
        const res = await setPrimaryImage(externalId, mediaId);
        if (!res.ok) {
          throw new Error(res.message ?? 'Failed to set primary image');
        }
      }}
      className="flex items-center gap-2"
    >
      <input
        name="mediaId"
        placeholder="paste mediaId (UUID)"
        className="border rounded px-3 py-1 w-[240px]"
        required
      />
      <button className="px-3 py-1 rounded bg-blue-600 text-white">
        Set primary
      </button>
    </form>
  );
}

function Pager({
  total,
  limit,
  offset,
  q,
}: {
  total: number;
  limit: number;
  offset: number;
  q: string;
}) {
  const page = Math.floor(offset / limit) + 1;
  const pages = Math.max(1, Math.ceil(total / limit));
  const mk = (p: number) => {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    sp.set('limit', String(limit));
    sp.set('offset', String((p - 1) * limit));
    return `?${sp.toString()}`;
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <span className="text-sm text-gray-600">
        {total} total • page {page} / {pages}
      </span>
      <div className="flex items-center gap-2">
        <a
          href={mk(1)}
          className="px-2 py-1 border rounded text-sm hover:bg-gray-50"
        >
          « First
        </a>
        <a
          href={mk(Math.max(1, page - 1))}
          className="px-2 py-1 border rounded text-sm hover:bg-gray-50"
        >
          ‹ Prev
        </a>
        <a
          href={mk(Math.min(pages, page + 1))}
          className="px-2 py-1 border rounded text-sm hover:bg-gray-50"
        >
          Next ›
        </a>
        <a
          href={mk(pages)}
          className="px-2 py-1 border rounded text-sm hover:bg-gray-50"
        >
          Last »
        </a>
      </div>
    </div>
  );
}