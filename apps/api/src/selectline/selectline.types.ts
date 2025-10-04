// ---- Groups (raw) ----
export interface SlArticleGroupRaw {
  Number: string;
  Description: string;
  Kind: 'AG' | string;
  AdditionalDescription: string | null;
  ShopPosition: number | null;
  ParentArticleGroupNumber: string | null;
}

// ---- Articles (raw - compact list) ----
export interface SlArticleRaw {
  Number: string;
  EuropeanArticleNumber: string | null;
  Name: string;
  Description: string | null;
  AdditionalDescription: string | null;
  ArticleGroupNumber: string;
  QuantityUnit: string | null;
  MetaData?: { ModificationDate?: string | null } | null;
}

// ---- Macro enriched record (columnar) ----
export interface MacroColumnResponse {
  ColumnNames: string[];
  Rows: { ColumnValues: unknown[] }[];
}

// ---- Normalized app shapes ----
export interface SlArticleGroup {
  id: string;              // Number
  name: string;            // Description
  description?: string | null;
  parentId?: string | null;
  sortOrder?: number | null;
}

export interface SlArticle {
  externalId: string;      // Number
  groupExternalId: string; // ArticleGroupNumber
  sku: string;             // Number
  ean: string | null;      // EuropeanArticleNumber
  title: string;           // Name
  description: string | null; // Description || AdditionalDescription
  uom: string | null;      // QuantityUnit
  updatedAt: string | null;// MetaData.ModificationDate
  attributes: Record<string, unknown> | null; // macro-attached
}