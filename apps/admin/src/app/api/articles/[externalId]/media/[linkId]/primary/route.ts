import { NextResponse } from 'next/server';
import { adminFetch } from '@/lib/admin-client';
export async function POST(req: Request, { params }: { params: Promise<{ externalId: string; linkId: string }> }) {
  const { externalId, linkId } = await params;
  const res = await adminFetch(`/admin/articles/${encodeURIComponent(externalId)}/media/${linkId}/primary`, { method: 'POST' });
  if (!res.ok) return NextResponse.json({ ok: false }, { status: res.status });
  // refresh by redirecting back
  const url = new URL(req.url);
  const redirectTo = new URL(`/articles/${encodeURIComponent(externalId)}`, url.origin);

  return NextResponse.redirect(redirectTo, 303);
}