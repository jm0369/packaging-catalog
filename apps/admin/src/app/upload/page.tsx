export const dynamic = 'force-dynamic';

export default function UploadPage() {
  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold mb-3">Upload group image</h1>
      <form action="/api/upload" method="POST" encType="multipart/form-data" className="space-y-3">
        <input type="file" name="file" accept="image/*" required className="block" />
        <button className="px-3 py-2 rounded bg-black text-white">Upload</button>
      </form>
      <p className="text-sm text-gray-500 mt-3">
        After uploading, copy the returned <code>mediaId</code> and link it to a group on the “Link” page.
      </p>
    </div>
  );
}