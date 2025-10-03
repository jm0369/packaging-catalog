'use client';

import { useState, useTransition } from 'react';

type Props = {
  externalId: string;
  initialActive: boolean;
};

export function ArticleActiveToggle({ externalId, initialActive }: Props) {
  const [active, setActive] = useState<boolean>(initialActive);
  const [pending, startTransition] = useTransition();

  async function onChange(next: boolean) {
    setActive(next);
    startTransition(async () => {
      const res = await fetch(
        `/api/articles/${encodeURIComponent(externalId)}/active`,
        {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ active: next }),
        }
      );
      if (!res.ok) {
        // revert if failed
        setActive(!next);
        alert('Failed to update status');
      }
    });
  }

  return (
    <label className="inline-flex items-center gap-2">
      <input
        type="checkbox"
        checked={active}
        onChange={(e) => onChange(e.target.checked)}
        disabled={pending}
      />
      <span className="text-sm">
        {pending ? 'Saving…' : active ? 'Active' : 'Inactive'}
      </span>
    </label>
  );
}