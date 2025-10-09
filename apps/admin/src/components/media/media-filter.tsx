'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

const FILTER_OPTIONS = [
  { value: '', label: 'All Media' },
  { value: 'unused', label: 'No Connections' },
  { value: 'groups', label: 'Has Groups' },
  { value: 'articles', label: 'Has Articles' },
  { value: 'categories', label: 'Has Categories' },
];

export function MediaFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentFilter = searchParams.get('filter') || '';

  const handleFilterChange = (filterValue: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (filterValue) {
        params.set('filter', filterValue);
      } else {
        params.delete('filter');
      }
      
      params.delete('page'); // Reset to page 1 on filter change
      
      router.push(`/media?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Filter:</span>
      <div className="flex gap-2">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleFilterChange(option.value)}
            disabled={isPending}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors disabled:opacity-50 ${
              currentFilter === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
