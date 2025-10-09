/**
 * Converts a category name to a URL-safe slug
 * - Converts to lowercase
 * - Replaces German umlauts (ä, ö, ü, ß) with their equivalents
 * - Replaces spaces with hyphens
 * - Removes special characters
 */
export function slugifyCategory(name: string): string {
    return name
        .toLowerCase()
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}
