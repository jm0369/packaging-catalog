import { NextRequest, NextResponse } from 'next/server';
import { adminFetch } from '@/lib/admin-client';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ externalId: string }> },
) {
  const { externalId } = await params;
  const body = await req.json(); // { order: string[] }

  const upstream = await adminFetch(
    `/admin/article-groups/${externalId}/media/reorder`,
    {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    },
  );

  const buf = await upstream.arrayBuffer();
  return new NextResponse(buf, {
    status: upstream.status,
    headers: {
      'content-type':
        upstream.headers.get('content-type') ?? 'application/json',
    },
  });
}