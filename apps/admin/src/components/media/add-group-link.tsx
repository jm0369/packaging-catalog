'use client';

import { useState } from 'react';

type AddGroupLinkProps = {
  mediaId: string;
  onSuccess: () => void;
};

export function AddGroupLink({ mediaId, onSuccess }: AddGroupLinkProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [groupExternalId, setGroupExternalId] = useState('');
  const [altText, setAltText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/media/${mediaId}/link-to-group`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupExternalId: groupExternalId.trim(),
          altText: altText.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to link to group');
      }

      setGroupExternalId('');
      setAltText('');
      setIsAdding(false);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="text-sm text-blue-600 hover:underline"
      >
        + Add Group Connection
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 bg-gray-50 space-y-3">
      <h3 className="font-semibold text-sm">Add Group Connection</h3>
      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm">
          <span className="text-gray-700 font-medium">Group External ID *</span>
          <input
            type="text"
            value={groupExternalId}
            onChange={(e) => setGroupExternalId(e.target.value)}
            placeholder="e.g., GROUP123"
            required
            className="mt-1 block w-full border rounded px-3 py-2 text-sm"
          />
        </label>

        <label className="block text-sm">
          <span className="text-gray-700 font-medium">Alt Text (optional)</span>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Descriptive text for the image"
            className="mt-1 block w-full border rounded px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting || !groupExternalId.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding...' : 'Add Connection'}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsAdding(false);
            setGroupExternalId('');
            setAltText('');
            setError(null);
          }}
          disabled={isSubmitting}
          className="px-4 py-2 border rounded text-sm hover:bg-gray-100 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
