// apps/admin/src/app/api/groups/[externalId]/media/reorder/route.ts
import { NextResponse } from 'next/server';
import { adminFetch } from '@/lib/admin-client';

export const dynamic = 'force-dynamic'; // ensure this route is always dynamic

type Ctx = { params: { externalId: string } };

// Accepts either JSON: { order: string[] } OR multipart form: ids[]=...&ids[]=...
export async function POST(req: Request, ctx: Ctx) {
  const externalId = ctx.params.externalId; // Next already decoded it

  // Parse incoming body as JSON or FormData
  let order: string[] = [];
  const contentType = req.headers.get('content-type') || '';

  try {
    if (contentType.includes('application/json')) {
      const body = (await req.json());
      order = Array.isArray(body?.order)
        ? body.order.map(String)
        : Array.isArray(body)
        ? body.map(String)
        : [];
    } else if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      const ids = form.getAll('ids[]');
      order = ids.map((v) => String(v));
    } else {
      // Try best-effort JSON parse for other content types
      const raw = await req.text();
      try {
        const body = JSON.parse(raw);
        order = Array.isArray(body?.order)
          ? body.order.map(String)
          : Array.isArray(body)
          ? body.map(String)
          : [];
      } catch {
        order = [];
      }
    }
  } catch {
    return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  }

  // Forward to Nest admin endpoint (encode for upstream)
  const upstream = await adminFetch(
    `/admin/article-groups/${encodeURIComponent(externalId)}/media/reorder`,
    {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ order }),
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