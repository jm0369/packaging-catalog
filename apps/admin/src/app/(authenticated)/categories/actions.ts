'use server';

import { adminFetch } from '@/lib/admin-client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCategory(formData: FormData): Promise<{ ok: boolean; error?: string; id?: string }> {
  const name = formData.get('name') as string;
  const color = formData.get('color') as string;

  if (!name || !color) {
    return { ok: false, error: 'Name and color are required' };
  }

  const res = await adminFetch('/admin/categories', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { ok: false, error: `Failed: ${res.status} ${text}` };
  }

  const data = await res.json();
  revalidatePath('/categories');
  return { ok: true, id: data.id };
}

export async function updateCategory(
  id: string,
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const name = formData.get('name') as string;
  const color = formData.get('color') as string;

  if (!name || !color) {
    return { ok: false, error: 'Name and color are required' };
  }

  const res = await adminFetch(`/admin/categories/${id}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { ok: false, error: `Failed: ${res.status} ${text}` };
  }

  revalidatePath('/categories');
  revalidatePath(`/categories/${id}`);
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<{ ok: boolean; error?: string }> {
  const res = await adminFetch(`/admin/categories/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { ok: false, error: `Failed: ${res.status} ${text}` };
  }

  revalidatePath('/categories');
  redirect('/categories');
}

export async function assignCategoryToGroup(
  categoryId: string,
  groupId: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await adminFetch(`/admin/categories/${categoryId}/groups/${groupId}`, {
    method: 'POST',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { ok: false, error: `Failed: ${res.status} ${text}` };
  }

  revalidatePath(`/categories/${categoryId}`);
  return { ok: true };
}

export async function removeCategoryFromGroup(
  categoryId: string,
  groupId: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await adminFetch(`/admin/categories/${categoryId}/groups/${groupId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { ok: false, error: `Failed: ${res.status} ${text}` };
  }

  revalidatePath(`/categories/${categoryId}`);
  return { ok: true };
}
