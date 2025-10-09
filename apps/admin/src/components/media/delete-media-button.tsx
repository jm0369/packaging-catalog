'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type DeleteMediaButtonProps = {
  mediaId: string;
  usageCount: number;
};

export function DeleteMediaButton({ mediaId, usageCount }: DeleteMediaButtonProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/media/${mediaId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to delete media asset');
      }

      // Redirect to media list after successful deletion
      router.push('/media');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setIsDeleting(false);
    }
  };

  if (usageCount > 0) {
    return (
      <div className="text-sm text-gray-500">
        Cannot delete: used in {usageCount} location{usageCount !== 1 ? 's' : ''}
      </div>
    );
  }

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium"
      >
        Delete Asset
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm font-medium text-gray-900">
        Are you sure?
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
      >
        {isDeleting ? 'Deleting...' : 'Yes, Delete'}
      </button>
      <button
        onClick={() => {
          setShowConfirm(false);
          setError(null);
        }}
        disabled={isDeleting}
        className="px-3 py-1.5 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
      >
        Cancel
      </button>
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
    </div>
  );
}
