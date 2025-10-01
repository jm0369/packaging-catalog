import Link from "next/link";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-semibold mb-2">Not found</h1>
      <p className="text-gray-600">We couldn’t find what you’re looking for.</p>
      <Link className="inline-block mt-6 border rounded px-4 py-2" href="/">Go home</Link>
    </div>
  );
}