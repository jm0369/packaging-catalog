import { NextResponse, NextRequest } from 'next/server';
import { adminFetch } from '@/lib/admin-client';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { externalId: string } },
) {
  const body = await req.json().catch(() => ({}));
  const upstream = await adminFetch(
    `/admin/articles/${encodeURIComponent(params.externalId)}/active`,
    {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ active: !!body.active }),
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

// Optional: simple form POST fallback (HTML forms)
export async function POST(
  req: NextRequest,
  ctx: { params: { externalId: string } },
) {
  const form = await req.formData();
  const active = String(form.get('active')).toLowerCase() === 'true';
  const r = await PATCH(
    new NextRequest(req.url, {
      method: 'PATCH',
      headers: req.headers,
      body: JSON.stringify({ active }),
    }),
    ctx,
  );
  return r;
}