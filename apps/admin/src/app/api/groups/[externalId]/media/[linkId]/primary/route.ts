import { NextResponse } from 'next/server';
import { adminFetch } from '@/lib/admin-client';

export async function POST(req: Request, { params }: { params: Promise<{ externalId: string; linkId: string }> }) {
  const { externalId, linkId } = await params;
  const res = await adminFetch(`/admin/article-groups/${encodeURIComponent(externalId)}/media/${linkId}/primary`, { method: 'POST' });
  
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: 'Failed to set primary' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json({ ok: true, data });
}