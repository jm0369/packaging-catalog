'use client';

import { useState } from 'react';

type RemoveLinkButtonProps = {
  mediaId: string;
  linkId: string;
  linkType: 'group' | 'article';
  entityName: string;
  onSuccess: () => void;
};

export function RemoveLinkButton({ 
  mediaId, 
  linkId, 
  linkType, 
  entityName,
  onSuccess 
}: RemoveLinkButtonProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRemove = async () => {
    if (!confirm(`Remove connection to ${entityName}?`)) {
      return;
    }

    setError(null);
    setIsRemoving(true);

    try {
      const endpoint = linkType === 'group' 
        ? `/api/media/${mediaId}/unlink-from-group/${linkId}`
        : `/api/media/${mediaId}/unlink-from-article/${linkId}`;

      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to remove connection');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setIsRemoving(false);
    }
  };

  return (
    <div className="space-y-1">
      <button
        onClick={handleRemove}
        disabled={isRemoving}
        className="text-sm text-red-600 hover:underline disabled:opacity-50"
      >
        {isRemoving ? 'Removing...' : 'Remove'}
      </button>
      {error && (
        <div className="text-xs text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
