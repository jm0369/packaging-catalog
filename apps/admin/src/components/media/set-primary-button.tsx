'use client';

import { useState } from 'react';

type SetPrimaryButtonProps = {
  linkId: string;
  linkType: 'group' | 'article' | 'category';
  entityId: string; // externalId for group/article, id for category
  isPrimary: boolean;
  onSuccess: () => void;
};

export function SetPrimaryButton({
  linkId,
  linkType,
  entityId,
  isPrimary,
  onSuccess,
}: SetPrimaryButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetPrimary = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const endpoint =
        linkType === 'group'
          ? `/api/groups/${entityId}/media/${linkId}/primary`
          : linkType === 'article'
          ? `/api/articles/${entityId}/media/${linkId}/primary`
          : `/api/categories/${entityId}/media/${linkId}/primary`;

      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to set as primary');
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setIsSubmitting(false);
    }
  };

  if (isPrimary) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-100 text-green-800 text-xs font-medium">
        ★ Primary
      </span>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleSetPrimary}
        disabled={isSubmitting}
        className="text-xs text-blue-600 hover:underline disabled:opacity-50"
        title="Set as primary image"
      >
        {isSubmitting ? 'Setting...' : '⭐ Set Primary'}
      </button>
      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
}
