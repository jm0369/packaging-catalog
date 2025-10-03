// apps/admin/src/app/api/articles/[externalId]/media/reorder/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminFetch } from '@/lib/admin-client';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: { externalId: string } },
) {
  const { externalId } = params;
  const ct = req.headers.get('content-type') || '';

  let order: string[] = [];

  try {
    if (ct.includes('application/json')) {
      const body = (await req.json());
      order = Array.isArray(body?.order)
        ? body.order.map(String)
        : Array.isArray(body)
        ? body.map(String)
        : [];
    } else if (ct.includes('multipart/form-data')) {
      const form = await req.formData();
      // support ids[]=... entries OR a single 'order' JSON string
      const ids = form.getAll('ids[]');
      if (ids.length) {
        order = ids.map((v) => String(v));
      } else {
        const raw = form.get('order');
        if (typeof raw === 'string') {
          try {
            const parsed = JSON.parse(raw);
            order = Array.isArray(parsed) ? parsed.map(String) : [];
          } catch {
            order = [];
          }
        }
      }
    } else {
      // Fallback: read text and try JSON parse
      const text = await req.text();
      try {
        const parsed = JSON.parse(text);
        order = Array.isArray(parsed?.order)
          ? parsed.order.map(String)
          : Array.isArray(parsed)
          ? parsed.map(String)
          : [];
      } catch {
        order = [];
      }
    }
  } catch {
    return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  }

  const upstream = await adminFetch(
    `/admin/articles/${encodeURIComponent(externalId)}/media/reorder`,
    {
      method: 'PATCH', // or 'POST' if your Nest route expects POST
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