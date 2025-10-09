import { NextRequest, NextResponse } from 'next/server';
import { adminFetch } from '@/lib/admin-client';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; linkId: string }> }
) {
  const { id, linkId } = await params;

  const upstream = await adminFetch(
    `/admin/media-assets/${id}/unlink-from-category/${linkId}`,
    { method: 'DELETE' }
  );

  const data = await upstream.json();

  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status });
  }

  return NextResponse.json(data);
}
