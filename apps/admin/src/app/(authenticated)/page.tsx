import Link from "next/link";

export const revalidate = 0;

export default function AdminHome() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <ul className="list-disc list-inside">
        <li><Link className="underline" href="/groups">Manage group images</Link></li>
        <li><Link className="underline" href="/articles">Manage article images</Link></li>
      </ul>
    </div>
  );
}