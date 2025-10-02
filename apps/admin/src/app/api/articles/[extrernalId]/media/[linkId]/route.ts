// apps/admin/src/app/api/articles/[externalId]/media/[linkId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminFetch } from '@/lib/admin-client';

export async function POST(req: NextRequest, { params }: { params: { externalId: string; linkId: string } }) {
  const form = await req.formData();
  const methodOverride = form.get('_method');
  if (methodOverride === 'DELETE') {
    const u = await adminFetch(`/admin/articles/${encodeURIComponent(params.externalId)}/media/${params.linkId}`, { method: 'DELETE' });
    return new NextResponse(await u.arrayBuffer(), { status: u.status, headers: { 'content-type': 'application/json' } });
  }
  return NextResponse.json({ error: 'unsupported' }, { status: 400 });
}