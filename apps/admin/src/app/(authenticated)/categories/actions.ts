'use server';

import { adminFetch } from '@/lib/admin-client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCategory(formData: FormData): Promise<{ ok: boolean; error?: string; id?: string }> {
  const name = formData.get('name') as string;
  const color = formData.get('color') as string;
  const description = formData.get('description') as string;
  
  // Parse JSON fields
  const parseJsonField = (fieldName: string) => {
    const value = formData.get(fieldName) as string;
    if (!value || value.trim() === '') return undefined;
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  };

  if (!name || !color) {
    return { ok: false, error: 'Name and color are required' };
  }

  const body: {
    name: string;
    color: string;
    description?: string;
    properties?: unknown;
    applications?: unknown;
    formatsSpecifications?: unknown;
    keyFigures?: unknown;
    ordering?: unknown;
    orderingNotes?: unknown;
  } = { name, color };
  if (description) body.description = description;
  
  const properties = parseJsonField('properties');
  if (properties) body.properties = properties;
  
  const applications = parseJsonField('applications');
  if (applications) body.applications = applications;
  
  const formatsSpecifications = parseJsonField('formatsSpecifications');
  if (formatsSpecifications) body.formatsSpecifications = formatsSpecifications;
  
  const keyFigures = parseJsonField('keyFigures');
  if (keyFigures) body.keyFigures = keyFigures;
  
  const ordering = parseJsonField('ordering');
  if (ordering) body.ordering = ordering;
  
  const orderingNotes = parseJsonField('orderingNotes');
  if (orderingNotes) body.orderingNotes = orderingNotes;

  const res = await adminFetch('/admin/categories', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
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
  const description = formData.get('description') as string;
  
  // Parse JSON fields
  const parseJsonField = (fieldName: string) => {
    const value = formData.get(fieldName) as string;
    if (!value || value.trim() === '') return undefined;
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  };

  if (!name || !color) {
    return { ok: false, error: 'Name and color are required' };
  }

  const body: {
    name: string;
    color: string;
    description?: string;
    properties?: unknown;
    applications?: unknown;
    formatsSpecifications?: unknown;
    keyFigures?: unknown;
    ordering?: unknown;
    orderingNotes?: unknown;
  } = { name, color };
  if (description) body.description = description;
  
  const properties = parseJsonField('properties');
  if (properties !== undefined) body.properties = properties;
  
  const applications = parseJsonField('applications');
  if (applications !== undefined) body.applications = applications;
  
  const formatsSpecifications = parseJsonField('formatsSpecifications');
  if (formatsSpecifications !== undefined) body.formatsSpecifications = formatsSpecifications;
  
  const keyFigures = parseJsonField('keyFigures');
  if (keyFigures !== undefined) body.keyFigures = keyFigures;
  
  const ordering = parseJsonField('ordering');
  if (ordering !== undefined) body.ordering = ordering;
  
  const orderingNotes = parseJsonField('orderingNotes');
  if (orderingNotes !== undefined) body.orderingNotes = orderingNotes;

  const res = await adminFetch(`/admin/categories/${id}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
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
