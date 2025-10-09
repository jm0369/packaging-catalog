import { NextResponse } from 'next/server';
import { adminFetch } from '@/lib/admin-client';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const res = await adminFetch(`/admin/media-assets/${id}`, {
    method: 'DELETE',
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  return NextResponse.json(data);
}
