import Link from 'next/link';
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
          <div className="container mx-auto p-4">
            <Link href="/" className="font-semibold">Catalog</Link>
          </div>
        </header>
        <main className="container mx-auto p-4">{children}</main>
        <footer className="border-t mt-12">
          <div className="container mx-auto p-4 text-sm flex gap-4">
            <a href="/impressum" className="underline">Impressum</a>
            <a href="/privacy" className="underline">Privacy</a>
          </div>
        </footer>
      </body>
    </html>
  );
}