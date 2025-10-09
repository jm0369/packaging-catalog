'use client';

import { useState, useEffect } from 'react';

type Category = {
  id: string;
  name: string;
  type: string;
  color: string;
};

type AddCategoryLinkProps = {
  mediaId: string;
  onSuccess: () => void;
};

export function AddCategoryLink({ mediaId, onSuccess }: AddCategoryLinkProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [altText, setAltText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  useEffect(() => {
    if (isAdding && categories.length === 0) {
      loadCategories();
    }
  }, [isAdding]);

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/categories`);
      if (!res.ok) throw new Error('Failed to load categories');
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/media/${mediaId}/link-to-category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: selectedCategoryId,
          altText: altText.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to link to category');
      }

      setSelectedCategoryId('');
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
        + Add Category Connection
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 bg-gray-50 space-y-3">
      <h3 className="font-semibold text-sm">Add Category Connection</h3>
      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm">
          <span className="text-gray-700 font-medium">Category *</span>
          {isLoadingCategories ? (
            <div className="mt-1 text-gray-500">Loading categories...</div>
          ) : (
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              required
              className="mt-1 block w-full border rounded px-3 py-2 text-sm"
            >
              <option value="">Select a category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.type})
                </option>
              ))}
            </select>
          )}
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
          disabled={isSubmitting || !selectedCategoryId || isLoadingCategories}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding...' : 'Add Connection'}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsAdding(false);
            setSelectedCategoryId('');
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
