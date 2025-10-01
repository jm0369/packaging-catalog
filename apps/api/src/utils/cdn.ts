export function cdnUrlForKey(key?: string | null) {
  if (!key) return null;
  const base = (process.env.PUBLIC_CDN_BASE ?? '').replace(/\/+$/, '');
  if (!base) {
    // Fallback for dev if you forgot the env; at least make it absolute to current host
    return `/${key.replace(/^\/+/, '')}`;
  }
  return `${base}/${key.replace(/^\/+/, '')}`;
}
