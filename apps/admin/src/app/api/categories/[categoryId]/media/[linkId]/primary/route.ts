import { NextRequest, NextResponse } from 'next/server';
import { adminFetch } from '@/lib/admin-client';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ categoryId: string; linkId: string }> }
) {
  const { categoryId, linkId } = await params;

  const upstream = await adminFetch(
    `/admin/categories/${categoryId}/media/${linkId}/primary`,
    { method: 'POST' }
  );

  const data = await upstream.json();

  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status });
  }

  return NextResponse.json(data);
}
