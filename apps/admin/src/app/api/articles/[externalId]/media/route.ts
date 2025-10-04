// apps/admin/src/app/api/articles/[externalId]/media/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminFetch } from '@/lib/admin-client';

export async function GET(_: NextRequest, { params }: { params: Promise<{ externalId: string }> }) {
  const { externalId } = await params;
  const u = await adminFetch(`/admin/articles/${externalId}/media`, { cache: 'no-store' });
  return new NextResponse(await u.arrayBuffer(), { status: u.status, headers: { 'content-type': u.headers.get('content-type') ?? 'application/json' } });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ externalId: string }> }) {
  const { externalId } = await params;
  const body = await req.json();
  const u = await adminFetch(`/admin/articles/${externalId}/media`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  });
  return new NextResponse(await u.arrayBuffer(), { status: u.status, headers: { 'content-type': u.headers.get('content-type') ?? 'application/json' } });
}