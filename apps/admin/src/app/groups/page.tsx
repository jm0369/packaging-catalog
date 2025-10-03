import Link from 'next/link';
import Image from 'next/image';
import { fetchGroups } from '@/lib/admin-api';
import { setGroupActiveAction } from '@/lib/admin-actions';

export const revalidate = 0; // always fresh in admin

type Search = {
    q?: string;
    limit?: string;
    offset?: string;
};

// Simple badge
function ActiveBadge({ active }: { active: boolean }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${active
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-200 text-gray-700'
                }`}
        >
            {active ? 'Active' : 'Inactive'}
        </span>
    );
}

// Pagination links (Prev / Next)
function Pager({
    total,
    limit,
    offset,
    q,
}: {
    total: number;
    limit: number;
    offset: number;
    q?: string;
}) {
    const prevOffset = Math.max(0, offset - limit);
    const nextOffset = offset + limit;
    const hasPrev = offset > 0;
    const hasNext = nextOffset < total;

    const mkUrl = (o: number) => {
        const sp = new URLSearchParams();
        sp.set('limit', String(limit));
        sp.set('offset', String(o));
        if (q) sp.set('q', q);
        return `/groups?${sp.toString()}`;
    };

    return (
        <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
                Showing <strong>{offset + 1}</strong>–<strong>{Math.min(offset + limit, total)}</strong> of{' '}
                <strong>{total}</strong>
            </div>
            <div className="space-x-2">
                <Link
                    className={`px-3 py-1.5 rounded border ${hasPrev ? 'hover:bg-gray-50' : 'opacity-50 pointer-events-none'}`}
                    href={mkUrl(prevOffset)}
                >
                    Prev
                </Link>
                <Link
                    className={`px-3 py-1.5 rounded border ${hasNext ? 'hover:bg-gray-50' : 'opacity-50 pointer-events-none'}`}
                    href={mkUrl(nextOffset)}
                >
                    Next
                </Link>
            </div>
        </div>
    );
}

export default async function AdminGroupsPage({
    searchParams,
}: {
    // Next.js App Router passes these as async in some adapters; await to avoid warnings
    searchParams: Promise<Search> | Search;
}) {
    const sp = await searchParams;
    const q = sp.q?.trim() || undefined;
    const limit = Math.min(100, Math.max(1, Number(sp.limit ?? 50)));
    const offset = Math.max(0, Number(sp.offset ?? 0));

    const { data, total } = await fetchGroups({ q, limit, offset });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold">Groups</h1>
                <Link
                    href="/upload"
                    className="px-3 py-2 rounded bg-black text-white"
                >
                    Upload new image
                </Link>
            </div>

            {/* Search form (GET) */}
            <form className="flex gap-2" action="/groups" method="GET">
                <input
                    type="hidden"
                    name="limit"
                    value={String(limit)}
                />
                <input
                    name="q"
                    defaultValue={q ?? ''}
                    placeholder="Search by name or description…"
                    className="flex-1 rounded border px-3 py-2"
                />
                <button className="rounded border px-3 py-2 hover:bg-gray-50">
                    Search
                </button>
            </form>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-left border-b">Image</th>
                            <th className="px-3 py-2 text-left border-b">Name</th>
                            <th className="px-3 py-2 text-left border-b">External ID</th>
                            <th className="px-3 py-2 text-left border-b">Status</th>
                            <th className="px-3 py-2 text-right border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-3 py-8 text-center text-gray-500">
                                    No groups found.
                                </td>
                            </tr>
                        ) : (
                            data.map((g) => (
                                <tr key={g.id} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 border-b">
                                        {g.imageUrl ? (
                                            <div className="relative h-12 w-20 overflow-hidden rounded border">
                                                <Image
                                                    src={g.imageUrl}
                                                    alt={g.name}
                                                    fill
                                                    sizes="80px"
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="h-12 w-20 rounded border bg-gray-100" />
                                        )}
                                    </td>
                                    <td className="px-3 py-2 border-b">
                                        <div className="font-medium">{g.name}</div>
                                        {g.description ? (
                                            <div className="text-xs text-gray-500 line-clamp-1">
                                                {g.description}
                                            </div>
                                        ) : null}
                                    </td>
                                    <td className="px-3 py-2 border-b">
                                        <code className="text-xs">{g.externalId}</code>
                                    </td>
                                    <td className="px-3 py-2 border-b">
                                        <ActiveBadge active={g.active} />
                                    </td>
                                    <td className="px-3 py-2 border-b text-right">

                                        <div className="inline-flex gap-2">
                                            <Link
                                                className="underline"
                                                href={`/groups/${encodeURIComponent(g.externalId)}`}
                                            >
                                                Manage
                                            </Link>
                                            
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Pager total={total} limit={limit} offset={offset} q={q} />
        </div>
    );
}