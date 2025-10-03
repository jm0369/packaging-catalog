import { NextResponse } from 'next/server';
import { adminFetch } from '@/lib/admin-client';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  // pass through limit, offset, q; and force includeInactive=1
  const sp = new URLSearchParams(searchParams);
  sp.set('includeInactive', '1');

  const upstream = await adminFetch(`/admin/article-groups?${sp.toString()}`);
  const buf = await upstream.arrayBuffer();

  return new NextResponse(buf, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
    },
  });
}