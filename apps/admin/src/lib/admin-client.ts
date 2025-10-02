import 'server-only';

const API = process.env.NEXT_PUBLIC_API_BASE!;
const ADMIN = process.env.ADMIN_SHARED_SECRET!;

export async function adminFetch(
  input: string,
  init: RequestInit = {}
): Promise<Response> {
  const url = input.startsWith('http') ? input : `${API}${input}`;
  const headers = new Headers(init.headers);
  headers.set('x-admin-secret', ADMIN);
  return fetch(url, { ...init, headers });
}