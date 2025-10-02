'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MediaPickerModal } from '@/components/media-picker-modal';
import { setPrimaryImage } from './actions';

export function ChoosePrimaryButton({ externalId }: { externalId: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        className="px-3 py-1 rounded bg-indigo-600 text-white"
        onClick={() => setOpen(true)}
      >
        Choose…
      </button>

      {open && (
        <MediaPickerModal
          externalId={externalId}
          onClose={() => setOpen(false)}
          onPick={async (mediaId) => {
            await setPrimaryImage(externalId, mediaId);
            setOpen(false);
            router.refresh(); // show the new image in the table
          }}
        />
      )}
    </>
  );
}