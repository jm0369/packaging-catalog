import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-semibold">Not found</h1>
      <p className="text-gray-600 mt-2">The page you’re looking for doesn’t exist.</p>
      <Link href="/">
        Go back home
      </Link>
    </div>
  );
}