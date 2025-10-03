import Link from 'next/link';
import { adminFetch } from '@/lib/admin-client';

// Shared types
type Paged<T> = { total: number; limit: number; offset: number; data: T[] };

type Group = {
  id: string;
  externalId: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  active?: boolean;
};

type Article = {
  id: string;
  externalId: string;
  title: string;
  ean: string | null;
  uom: string | null;
  active?: boolean;
  updatedAt?: string;
  articleGroup?: { externalId: string; name?: string } | null;
};

// Helpers (use public read API for “active”; admin route for “all including inactive”)
async function fetchActiveGroupsTotal(): Promise<number> {
  const r = await adminFetch('/api/article-groups?limit=1&offset=0');
  if (!r.ok) return 0;
  const json = (await r.json()) as Paged<Group>;
  return json.total ?? 0;
}

async function fetchAllGroupsTotal(): Promise<number> {
  // You added this special admin route earlier to include inactive groups
  const r = await adminFetch('/admin/article-groups?includeInactive=1&limit=1&offset=0');
  if (!r.ok) return 0;
  const json = (await r.json()) as Paged<Group>;
  return json.total ?? 0;
}

async function fetchActiveArticlesTotal(): Promise<number> {
  const r = await adminFetch('/api/articles?limit=1&offset=0');
  if (!r.ok) return 0;
  const json = (await r.json()) as Paged<Article>;
  return json.total ?? 0;
}

async function fetchGroupsNeedingImages(limit = 8): Promise<Group[]> {
  const r = await adminFetch(`/api/article-groups?limit=${limit}&offset=0`);
  if (!r.ok) return [];
  const json = (await r.json()) as Paged<Group>;
  return (json.data ?? []).filter((g) => !g.imageUrl);
}

async function fetchRecentArticles(limit = 8): Promise<Article[]> {
  const r = await adminFetch(`/api/articles?limit=${limit}&offset=0`);
  if (!r.ok) return [];
  const json = (await r.json()) as Paged<Article>;
  return json.data ?? [];
}

export default async function AdminDashboardPage() {
  const [activeGroups, allGroups, activeArticles, groupsNeedingImages, recentArticles] =
    await Promise.all([
      fetchActiveGroupsTotal(),
      fetchAllGroupsTotal(),
      fetchActiveArticlesTotal(),
      fetchGroupsNeedingImages(8),
      fetchRecentArticles(8),
    ]);

  const inactiveGroups = Math.max(0, allGroups - activeGroups);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      </div>

      {/* KPI cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Groups (total)" value={allGroups} />
        <KpiCard label="Groups (active)" value={activeGroups} />
        <KpiCard label="Groups (inactive)" value={inactiveGroups} />
        <KpiCard label="Articles (active)" value={activeArticles} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Groups needing images */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Groups needing images</h2>
            <Link href="/groups" className="text-sm underline">View all groups</Link>
          </div>
          {groupsNeedingImages.length === 0 ? (
            <p className="text-gray-500">Looks good — all visible groups have images.</p>
          ) : (
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {groupsNeedingImages.map((g) => (
                <li key={g.id} className="border rounded p-3 space-y-2">
                  <div className="w-full h-24 bg-gray-100 rounded" />
                  <div className="text-sm font-medium line-clamp-2">{g.name}</div>
                  <Link
                    href={`/groups/${encodeURIComponent(g.externalId)}`}
                    className="text-sm underline"
                  >
                    Add image
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent articles */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent articles</h2>
            <Link href="/articles" className="text-sm underline">View all articles</Link>
          </div>
          {recentArticles.length === 0 ? (
            <p className="text-gray-500">No articles yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="px-3 py-2">External ID</th>
                    <th className="px-3 py-2">Title</th>
                    <th className="px-3 py-2">EAN</th>
                    <th className="px-3 py-2">Active</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentArticles.map((a) => (
                    <tr key={a.id} className="border-b">
                      <td className="px-3 py-2 font-mono">{a.externalId}</td>
                      <td className="px-3 py-2">{a.title}</td>
                      <td className="px-3 py-2">{a.ean ?? '—'}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 text-xs ${
                            a.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {a.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <Link
                          href={`/articles/${encodeURIComponent(a.externalId)}`}
                          className="underline"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// Tiny presentational card
function KpiCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded border p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}