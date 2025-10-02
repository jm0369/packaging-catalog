export const dynamic = 'force-dynamic';

export default function UploadPage({ searchParams }: { searchParams?: { group?: string } }) {
  const group = searchParams?.group ?? '';

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold mb-3">Upload group image</h1>

      {/* If a group is present, route will auto-link and then redirect back to that group */}
      <form action={`/api/upload${group ? `?group=${encodeURIComponent(group)}` : ''}`} method="POST" encType="multipart/form-data" className="space-y-3">
        <input type="file" name="file" accept="image/*" required className="block" />
        <button className="px-3 py-2 rounded bg-black text-white">Upload</button>
      </form>

      {!group ? (
        <p className="text-sm text-gray-500 mt-3">
          After uploading, you’ll get JSON with <code>id</code>. Use it to link the image on the “Link” page.
        </p>
      ) : (
        <p className="text-sm text-gray-500 mt-3">
          This will upload and immediately set the image as <strong>primary</strong> for group <code>{group}</code>, then return to that page.
        </p>
      )}
    </div>
  );
}