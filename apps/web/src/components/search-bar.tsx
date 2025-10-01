'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function SearchBar({ placeholder = 'Search…' }: { placeholder?: string }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get('q') ?? '');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(sp?.toString());
    if (q) {
      params.set('q', q);
      params.set('offset', '0'); // reset paging on new search
    } else {
      params.delete('q');
      params.set('offset', '0');
    }
    router.push(`?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2 mb-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="border rounded px-3 py-2 flex-1"
      />
      <button type="submit" className="border rounded px-4 py-2">Search</button>
    </form>
  );
}