// apps/admin/src/app/api/articles/[externalId]/media/[linkId]/primary/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminFetch } from '@/lib/admin-client';

export async function POST(_: NextRequest, { params }: { params: { externalId: string; linkId: string } }) {
  const u = await adminFetch(`/admin/articles/${encodeURIComponent(params.externalId)}/media/${params.linkId}/primary`, { method: 'PATCH' });
  return new NextResponse(await u.arrayBuffer(), { status: u.status, headers: { 'content-type': u.headers.get('content-type') ?? 'application/json' } });
}