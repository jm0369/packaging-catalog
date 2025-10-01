export type Paged<T> = { total: number; limit: number; offset: number; data: T[] };

export type Group = {
  id: string; externalId: string; name: string; description?: string | null; imageUrl?: string | null;
};

export type Article = {
  id: string; externalId: string; sku: string | null; ean: string | null;
  title: string; description: string | null; uom: string | null; active: boolean; updatedAt: string; articleGroupId: string;
};