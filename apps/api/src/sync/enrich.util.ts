import type { Prisma } from '@prisma/client';

/**
 * Merge new enriched payload into attributes.enriched while preserving other keys.
 * Returns a Prisma-compatible JSON input (handles null properly).
 */
export function mergeEnriched(
  current: unknown,
  patch: Record<string, unknown> | null,
): Prisma.InputJsonValue {
  // normalize current to object
  const base =
    typeof current === 'object' && current !== null
      ? (current as Record<string, unknown>)
      : {};

  if (!patch) return base as Prisma.InputJsonValue;

  const next = {
    ...base,
    enriched: patch,
    enrichedAt: new Date().toISOString(),
  };
  return next as Prisma.InputJsonValue;
}
