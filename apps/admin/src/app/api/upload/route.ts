import { NextResponse } from 'next/server';
import { adminFetch } from '@/lib/admin-client';

export async function POST(req: Request) {
  const form = await req.formData();               // contains `file`
  const upstream = await adminFetch('/admin/media/upload', {
    method: 'POST',
    body: form,                                    // multipart goes through fine
  });

  const buf = await upstream.arrayBuffer();
  return new NextResponse(buf, {
    status: upstream.status,
    headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
  });
}