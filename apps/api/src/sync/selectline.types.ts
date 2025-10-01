// Raw shape from SelectLine
export interface SlArticleGroupRaw {
  Number: string; // group external ID
  Description: string;
  Kind: string;
  AdditionalDescription: string | null;
  ShopPosition: number | null;
  ParentArticleGroupNumber: string | null;
}

// Normalized shape we use app-wide
export interface SlArticleGroup {
  id: string; // = Number
  name: string; // = Description
  description?: string | null; // = AdditionalDescription
  parentId?: string | null; // = ParentArticleGroupNumber
  sortOrder?: number | null; // = ShopPosition
  isActive?: boolean | null; // unknown -> default true
  updatedAt?: string | null; // unknown (not in payload)
}

// ----- Raw shape from SelectLine (your sample) -----
export interface SlArticleRaw {
  Number: string; // external article id
  EuropeanArticleNumber: string | null; // EAN
  Name: string; // short title
  Description: string | null; // long title/desc
  AdditionalDescription: string | null;
  MatchCode: string | null;

  ArticleGroupNumber: string; // foreign key -> ArticleGroupMirror.externalId
  ArticleGroupLabel: string | null;

  QuantityUnit: string | null; // e.g., "Stück"
  Weight: number | null;

  IsWarehouseArtikel: boolean;
  WarehouseId: string | null;

  ArticleKind: string;
  MakeOrBuyFlag: string | null;
  SerialOrChargeNumberFlag: string | null;

  VariantArticleNumber: string | null;

  HasMinusWarning: boolean;

  ManufacturerSupplierNumber: string | null;
  ManufacturerSupplierLabel: string | null;
  ManufacturerArticleNumber: string | null;

  DefaultSupplierNumber: string | null;
  DefaultSupplierLabel: string | null;

  DispositionFlag: string | null;
  AutomaticOrderFlag: string | null;

  PhasingOutDate: string; // "0001-01-01T00:00:00+01:00" possible
  IsInactive: boolean;
  IsShopActive: boolean;

  Payment: {
    ListPrice: number | null;
    CalculationPrice: number | null;
    PriceQuantityUnit: string | null;
    PriceQuantityFactor: number | null;
    PriceReferenceArticleNumber: string | null;
    PriceUnitFactor: number | null;
    SaleLotSize: number | null;
    // ...many fields omitted, we’ll keep full object in attributes
    [k: string]: unknown;
  } | null;

  Warehouse: {
    Stock: number | null;
    AvailableStock: number | null;
    ReservedStock: number | null;
    OrderedStock: number | null;
    // ...other fields
    [k: string]: unknown;
  } | null;

  CustomFields?: Record<string, unknown> | null;
  Intrastat?: Record<string, unknown> | null;

  MetaData?: {
    CreationDate?: string | null; // ISO
    CreationUserToken?: string | null;
    ModificationDate?: string | null; // ISO
    ModificationUserToken?: string | null;
  } | null;

  ArticleDescriptions?: unknown;
  HasAccessory?: unknown;
  HasSurcharge?: unknown;
}

// ----- Normalized app shape (fits your Prisma model) -----
export interface SlArticle {
  externalId: string; // -> ArticleMirror.externalId
  groupExternalId: string; // -> resolve to ArticleGroupMirror.id
  sku: string; // -> Number
  ean: string | null; // -> EuropeanArticleNumber
  title: string; // -> Name
  description: string | null; // -> Description || AdditionalDescription
  uom: string | null; // -> QuantityUnit
  active: boolean; // -> !IsInactive && IsShopActive
  updatedAt: string | null; // -> MetaData.ModificationDate
  attributes: Record<string, unknown> | null; // raw extras (price/stock/etc.)
}
