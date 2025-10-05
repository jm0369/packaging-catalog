'use client';

import { useTransition } from 'react';

export function RemoveCategoryButton({
  categoryId,
  categoryName,
  categoryColor,
  onRemove,
}: {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  onRemove: (categoryId: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await onRemove(categoryId);
    });
  };

  return (
    <div
      className="flex items-center gap-2 px-3 py-1 rounded-full border"
      style={{ borderColor: categoryColor }}
    >
      <div
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: categoryColor }}
      />
      <span className="text-sm">{categoryName}</span>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="text-gray-500 hover:text-red-600 ml-1 disabled:opacity-50"
        title="Remove category"
      >
        ×
      </button>
    </div>
  );
}
