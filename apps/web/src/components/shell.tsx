import Link from "next/link";

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-semibold">packaging-catalog</Link>
          <nav className="text-sm space-x-4">
            <a href="/(static)/impressum" className="hover:underline">Impressum</a>
            <a href="/(static)/privacy" className="hover:underline">Privacy</a>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 flex-1">{children}</main>
      <footer className="border-t text-sm text-gray-500">
        <div className="mx-auto max-w-6xl px-4 py-6">© {new Date().getFullYear()} Packaging Co.</div>
      </footer>
    </div>
  );
}