// apps/admin/src/app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { SignOutButton } from "@/components/signout-button";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b">
          <div className="container mx-auto p-3 flex items-center justify-between">
            <Link href="/" className="font-semibold">Admin</Link>
            <div className="flex gap-2">
              <Link href="/groups" className="px-3 py-2 rounded border">Groups</Link>
              <Link href="/articles" className="px-3 py-2 rounded border">Articles</Link>
              <SignOutButton />
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}