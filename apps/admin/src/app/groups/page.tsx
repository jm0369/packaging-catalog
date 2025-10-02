// apps/admin/src/app/groups/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { fetchGroups } from '@/lib/api';

export const revalidate = 600;

export default async function AdminGroupsPage() {
  const { data: groups } = await fetchGroups({ limit: 50, offset: 0 });

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Groups</h1>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-3">Image</th>
            <th className="py-2 pr-3">Name</th>
            <th className="py-2 pr-3">External ID</th>
            <th className="py-2 pr-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => (
            <tr key={g.id} className="border-b last:border-0">
              <td className="py-2 pr-3">
                {g.imageUrl ? (
                  <Image
                    src={g.imageUrl}
                    alt={g.name ?? g.externalId}
                    width={64}
                    height={40}
                    className="h-10 w-16 object-cover rounded"
                  />
                ) : (
                  <div className="h-10 w-16 bg-gray-100 rounded" />
                )}
              </td>
              <td className="py-2 pr-3">
                <Link
                  href={`/groups/${encodeURIComponent(g.externalId)}`}
                  className="text-blue-600 hover:underline"
                >
                  {g.name ?? g.externalId}
                </Link>
              </td>
              <td className="py-2 pr-3 font-mono text-xs">{g.externalId}</td>
              <td className="py-2 pr-3">
                <Link
                  href={`/groups/${encodeURIComponent(g.externalId)}`}
                  className="px-2 py-1 rounded border hover:bg-gray-50"
                >
                  Open
                </Link>
              </td>
            </tr>
          ))}
          {groups.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-gray-500">
                No groups found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}