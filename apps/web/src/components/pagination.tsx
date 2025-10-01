import Link from 'next/link';

export function Pagination({ total, limit, offset }: { total: number; limit: number; offset: number }) {
  const page = Math.floor(offset / limit) + 1;
  const pages = Math.max(1, Math.ceil(total / limit));
  const sp = (o: number) => {
    const u = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
    u.set('offset', String(o));
    u.set('limit', String(limit));
    return `?${u.toString()}`;
  };

  return (
    <div className="flex items-center gap-2 my-6">
      <Link className="border rounded px-2 py-1 disabled:opacity-50" href={page > 1 ? sp((page - 2) * limit) : '#'} aria-disabled={page <= 1}>Prev</Link>
      <span className="text-sm text-gray-600">Page {page} / {pages}</span>
      <Link className="border rounded px-2 py-1 disabled:opacity-50" href={page < pages ? sp(page * limit) : '#'} aria-disabled={page >= pages}>Next</Link>
    </div>
  );
}