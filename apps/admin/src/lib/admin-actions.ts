'use server';

import { revalidatePath } from 'next/cache';
import { adminFetch } from './admin-client';

/**
 * Server action: set group active flag.
 * Expects FormData with `externalId` and `active` ("true"/"false").
 */
export async function setGroupActiveAction(formData: FormData) {
  const externalId = String(formData.get('externalId') ?? '');
  const active = String(formData.get('active') ?? '') === 'true';

  if (!externalId) {
    throw new Error('externalId is required');
  }

  await adminFetch(`/admin/article-groups/${encodeURIComponent(externalId)}/active`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ active }),
  });

  // revalidate list + detail views
  revalidatePath('/groups');
  revalidatePath(`/groups/${encodeURIComponent(externalId)}`);
}