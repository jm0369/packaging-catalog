export const revalidate = 0;

export default async function UploadPage({ searchParams }: { searchParams?: Promise<{ group?: string; article?: string }> }) {
  const sp = (await searchParams) ?? {};
  const group = sp.group ?? '';
  const article = sp.article ?? '';

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-xl font-semibold">Upload image</h1>
      <form action="/api/upload" method="POST" encType="multipart/form-data" className="space-y-3">
        <input type="file" name="file" accept="image/*" required className="block" />
        {/* Optional: auto-link context */}
        <input type="hidden" name="group" value={group} />
        <input type="hidden" name="article" value={article} />
        <button className="px-3 py-2 rounded bg-black text-white">Upload</button>
      </form>
      <p className="text-sm text-gray-500">
        If you passed <code>?group=…</code> or <code>?article=…</code> in the URL, you’ll be redirected back after upload.
      </p>
    </div>
  );
}