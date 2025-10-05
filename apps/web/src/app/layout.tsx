import Link from 'next/link';
import Image from 'next/image';
import './globals.css';

export const metadata = {
  title: 'Catalog',
  description: 'Public catalog',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <header className="border-b">
          <div className="container mx-auto p-4 max-w-7xl">
            <nav className="flex items-center gap-6">
              <Link href="/" className="font-semibold">
                <Image src="/logo.png" alt="packCHAMPION" width={150} height={40} />
              </Link>
              <Link href="/groups" className="text-gray-600 hover:text-gray-900">Groups</Link>
              <Link href="/articles" className="text-gray-600 hover:text-gray-900">Articles</Link>
              <Link href="/categories" className="text-gray-600 hover:text-gray-900">Categories</Link>
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-4 max-w-7xl">{children}</main>
        <footer className="border-t mt-12">
          <div className="container mx-auto p-4 text-sm flex gap-4 max-w-7xl">
            <a href="/impressum" className="underline">Impressum</a>
            <a href="/privacy" className="underline">Privacy</a>
          </div>
        </footer>
      </body>
    </html>
  );
}