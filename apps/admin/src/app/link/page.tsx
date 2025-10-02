import { adminFetch } from '@/lib/admin-client';

async function linkMedia(formData: FormData) {
  'use server';
  const groupExternalId = String(formData.get('externalId') ?? '');
  const mediaId = String(formData.get('mediaId') ?? '');
  if (!groupExternalId || !mediaId) throw new Error('Both fields required');

  const res = await adminFetch(`/admin/article-groups/${encodeURIComponent(groupExternalId)}/media`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ mediaId }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to link: ${res.status} ${txt}`);
  }
}

export default function LinkPage() {
  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold mb-3">Link image to group</h1>
      <form action={linkMedia} className="space-y-3">
        <label className="block">
          <div className="text-sm mb-1">Group externalId</div>
          <input name="externalId" className="w-full border rounded px-3 py-2" placeholder="PC P B03" required />
        </label>
        <label className="block">
          <div className="text-sm mb-1">mediaId</div>
          <input name="mediaId" className="w-full border rounded px-3 py-2" placeholder="UUID from upload response" required />
        </label>
        <button className="px-3 py-2 rounded bg-black text-white">Link</button>
      </form>
    </div>
  );
}