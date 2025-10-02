// apps/admin/src/app/api/articles/[externalId]/media/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminFetch } from '@/lib/admin-client';

export async function POST(req: NextRequest, { params }: { params: { externalId: string } }) {
  const body = await req.json(); // { order: string[] }
  const u = await adminFetch(`/admin/articles/${encodeURIComponent(params.externalId)}/media/reorder`, {
    method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  });
  return new NextResponse(await u.arrayBuffer(), { status: u.status, headers: { 'content-type': u.headers.get('content-type') ?? 'application/json' } });
}