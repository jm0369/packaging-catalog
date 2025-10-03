// apps/admin/src/components/shell.tsx (example)
import Link from 'next/link';

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="border-b">
        <nav className="container mx-auto flex gap-4 p-3 text-sm">
          <Link href="/groups" className="underline">Groups</Link>
          <Link href="/articles" className="underline">Articles</Link>
          <Link href="/upload" className="underline">Upload</Link>
        </nav>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}