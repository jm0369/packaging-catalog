'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

export function MediaSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (searchValue.trim()) {
        params.set('search', searchValue.trim());
        params.delete('page'); // Reset to page 1 on new search
      } else {
        params.delete('search');
      }
      
      router.push(`/media?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setSearchValue('');
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('search');
      router.push(`/media?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search by filename, group, article, or category..."
          className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isPending}
        />
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            title="Clear search"
            disabled={isPending}
          >
            ✕
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isPending ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            Searching...
          </>
        ) : (
          <>
            🔍 Search
          </>
        )}
      </button>
    </form>
  );
}
