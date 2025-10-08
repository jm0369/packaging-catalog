// apps/admin/src/app/api/groups/[externalId]/media/[linkId]/route.ts
import { NextResponse } from 'next/server';
import { adminFetch } from '@/lib/admin-client';

export async function POST(req: Request, { params }: { params: Promise<{ externalId: string; linkId: string }> }) {
  const { externalId, linkId } = await params;
  const form = await req.formData();
  const isDelete = form.get('_method') === 'DELETE';
  if (isDelete) {
    const res = await adminFetch(`/admin/article-groups/${externalId}/media/${linkId}`, { method: 'DELETE' });
     const url = new URL(req.url);
  const redirectTo = new URL(`/groups/${encodeURIComponent(externalId)}`, url.origin);

    return res.ok
      ? NextResponse.redirect(redirectTo, 303)
      : NextResponse.json({ ok: false }, { status: res.status });
  }
  return NextResponse.json({ ok: false }, { status: 400 });
}