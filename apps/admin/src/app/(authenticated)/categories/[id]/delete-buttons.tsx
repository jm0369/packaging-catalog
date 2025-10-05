'use client';

import { useTransition } from 'react';

export function DeleteCategoryButton({ 
  onDelete 
}: { 
  onDelete: () => Promise<void> 
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (confirm('Delete this category? This will remove it from all groups.')) {
      startTransition(async () => {
        await onDelete();
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="px-3 py-2 rounded border border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {isPending ? 'Deleting...' : 'Delete Category'}
    </button>
  );
}

export function RemoveGroupButton({
  groupName,
  onRemove,
}: {
  groupName: string;
  onRemove: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (confirm(`Remove category from "${groupName}"?`)) {
      startTransition(async () => {
        await onRemove();
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="text-sm text-red-600 underline disabled:opacity-50"
    >
      {isPending ? 'Removing...' : 'Remove'}
    </button>
  );
}
