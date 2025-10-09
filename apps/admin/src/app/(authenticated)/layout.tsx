import { SignOutButton } from '@/components/signout-button';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b">
        <div className="container mx-auto p-4 flex gap-4 items-center">
          <Link href="/" className="font-semibold">Admin</Link>
          <Link href="/groups" className="underline">Groups</Link>
          <Link href="/articles" className="underline">Articles</Link>
          <Link href="/categories" className="underline">Categories</Link>
          <Link href="/media" className="underline">Media</Link>
          <div className="ml-auto">
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">{children}</main>
    </>
  );
}