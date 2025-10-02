import { NextResponse } from 'next/server';
import { adminFetch } from '@/lib/admin-client';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Optional: /api/upload?group=<externalId>
  const url = new URL(req.url);
  const group = url.searchParams.get('group') ?? null;

  // 1) pass-through multipart upload to Nest
  const form = await req.formData(); // must include field: file
  const upstream = await adminFetch('/admin/media/upload', {
    method: 'POST',
    body: form, // keep as multipart, don't set content-type
  });

  // Read upstream response as text to forward errors transparently
  const text = await upstream.text();
  let json: unknown = null;
  try { json = JSON.parse(text); } catch { /* not JSON (e.g. HTML/error) */ }

  if (!upstream.ok) {
    // Forward upstream error payload and status
    return new NextResponse(text, {
      status: upstream.status,
      headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
    });
  }

  // 2) If group provided and we have an id, auto-link as sortOrder=0
  const mediaId = (json as { id?: string })?.id;
  if (group && mediaId) {
    const linkRes = await adminFetch(`/admin/article-groups/${encodeURIComponent(group)}/media`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ mediaId, sortOrder: 0 }),
    });

    // If linking fails, show that error text
    if (!linkRes.ok) {
      const linkText = await linkRes.text();
      return new NextResponse(
        JSON.stringify({ error: 'link_failed', detail: linkText, uploaded: json }),
        { status: 502, headers: { 'content-type': 'application/json' } },
      );
    }

    // 3) Redirect back to group page (or wherever you like)
    const redirectTo = new URL(`/groups/${encodeURIComponent(group)}?uploaded=1`, url.origin);
    return NextResponse.redirect(redirectTo, 303);
  }

  // No group given: just return the original upload JSON (with id, key, etc.)
  return new NextResponse(JSON.stringify(json), {
    status: 200,
    headers: { 'content-type': upstream.headers.get('content-type') ?? 'application/json' },
  });
}