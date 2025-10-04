import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-12 text-center">
      <h1 className="text-2xl font-semibold">Not found</h1>
      <Link href="/" className="inline-block mt-4 underline">Back to admin</Link>
    </div>
  );
}