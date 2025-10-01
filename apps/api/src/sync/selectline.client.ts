import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { SlArticleGroup, SlArticleGroupRaw } from './selectline.types';
import { SlArticleRaw, SlArticle } from './selectline.types';

// Response shapes we might see; we normalize them.
// add these types above the class
type LoginResponse = {
  Token?: string;
  AccessToken?: string;
  token?: string;
  access_token?: string;
  ExpiresInSeconds?: number;
  expires_in?: number;
  ExpiresAt?: string | null;
};

@Injectable()
export class SelectLineClient {
  private readonly logger = new Logger(SelectLineClient.name);
  private token: string | null = null;
  private tokenExpiresAt = 0;

  constructor(private readonly http: HttpService) {}

  private get base(): string {
    const url = process.env.SELECTLINE_BASE_URL;
    if (!url) throw new Error('SELECTLINE_BASE_URL not set');
    return url.replace(/\/+$/, '');
  }

  private get authPath(): string {
    return (process.env.SELECTLINE_AUTH_PATH || '/slmobileApi/Login').replace(
      /^\/*/,
      '/',
    );
  }

  private get groupsPath(): string {
    // Default to what we see in your curl base: /slmobileApi/ArticleGroups
    // If your instance uses a different route, set SELECTLINE_GROUPS_PATH in .env
    return (
      process.env.SELECTLINE_GROUPS_PATH || '/slmobileApi/ArticleGroups'
    ).replace(/^\/*/, '/');
  }

  private get articlesPath(): string {
    // Adjust if your instance exposes a different route
    return (
      process.env.SELECTLINE_ARTICLES_PATH || '/slmobileApi/Articles'
    ).replace(/^\/*/, '/');
  }

  private coalesce(...vals: (string | null | undefined)[]) {
    for (const v of vals)
      if (typeof v === 'string' && v.trim() !== '') return v;
    return null;
  }

  private normalizeArticle(raw: SlArticleRaw): SlArticle {
    const title = raw.Name?.trim() || raw.Number;
    const desc = this.coalesce(raw.Description, raw.AdditionalDescription);
    const updated =
      raw.MetaData?.ModificationDate || raw.MetaData?.CreationDate || null;
    const active = !raw.IsInactive && !!raw.IsShopActive;

    // Keep potentially useful stuff for Phase 2 in attributes, but don’t expose to public UI.
    const attributes: Record<string, unknown> = {
      ArticleGroupLabel: raw.ArticleGroupLabel,
      MatchCode: raw.MatchCode,
      Weight: raw.Weight,
      Payment: raw.Payment ?? null,
      Warehouse: raw.Warehouse ?? null,
      CustomFields: raw.CustomFields ?? null,
      Intrastat: raw.Intrastat ?? null,
      Flags: {
        ArticleKind: raw.ArticleKind,
        MakeOrBuyFlag: raw.MakeOrBuyFlag,
        SerialOrChargeNumberFlag: raw.SerialOrChargeNumberFlag,
        HasMinusWarning: raw.HasMinusWarning,
        VariantArticleNumber: raw.VariantArticleNumber,
        DispositionFlag: raw.DispositionFlag,
        AutomaticOrderFlag: raw.AutomaticOrderFlag,
        IsWarehouseArtikel: raw.IsWarehouseArtikel,
      },
      MetaData: raw.MetaData ?? null,
      PhasingOutDate: raw.PhasingOutDate,
    };

    return {
      externalId: raw.Number,
      groupExternalId: raw.ArticleGroupNumber,
      sku: raw.Number,
      ean: raw.EuropeanArticleNumber ?? null,
      title,
      description: desc,
      uom: raw.QuantityUnit ?? null,
      active,
      updatedAt: updated,
      attributes,
    };
  }

  private normalizeGroup(r: SlArticleGroupRaw): SlArticleGroup {
    return {
      id: r.Number,
      name: r.Description,
      description: r.AdditionalDescription ?? null,
      parentId: r.ParentArticleGroupNumber ?? null,
      sortOrder: r.ShopPosition ?? null,
      isActive: true, // not provided → default true
      updatedAt: null, // not provided
    };
  }

  private get authHeader(): string {
    return process.env.SELECTLINE_AUTH_HEADER || 'Authorization';
  }

  private get authPrefix(): string {
    // e.g. 'Bearer' or '' if the API expects raw token
    return process.env.SELECTLINE_AUTH_PREFIX ?? 'Bearer';
  }

  private async authenticate(): Promise<void> {
    if (this.token && Date.now() < this.tokenExpiresAt - 10_000) return;

    const username = process.env.SELECTLINE_USERNAME!;
    const password = process.env.SELECTLINE_PASSWORD!;
    const appKey = process.env.SELECTLINE_APPKEY!;
    if (!username || !password || !appKey) {
      throw new Error(
        'SELECTLINE_USERNAME / SELECTLINE_PASSWORD / SELECTLINE_APPKEY must be set',
      );
    }

    const cfg: AxiosRequestConfig = {
      method: 'POST',
      url: `${this.base}${this.authPath}`,
      headers: { 'Content-Type': 'application/json' },
      data: { UserName: username, Password: password, AppKey: appKey },
      timeout: 20_000,
    };

    try {
      const res = await firstValueFrom(this.http.request<LoginResponse>(cfg));
      const body = res.data ?? {};

      // normalize token
      const token = body.AccessToken ?? body.token ?? body.access_token;

      if (!token || typeof token !== 'string') {
        this.logger.error(
          `Login response missing token: ${JSON.stringify(body).slice(0, 300)}`,
        );
        throw new Error('SelectLine login did not return a token');
      }

      this.token = token;

      // normalize expiry
      const ttlSeconds = body.ExpiresInSeconds ?? body.expires_in ?? undefined;

      if (ttlSeconds && typeof ttlSeconds === 'number') {
        this.tokenExpiresAt = Date.now() + ttlSeconds * 1000;
      } else if (body.ExpiresAt && typeof body.ExpiresAt === 'string') {
        const t = Date.parse(body.ExpiresAt);
        this.tokenExpiresAt = isNaN(t) ? Date.now() + 3600_000 : t;
      } else {
        // fallback 1 hour
        this.tokenExpiresAt = Date.now() + 3600_000;
      }

      this.logger.log('SelectLine: authenticated');
    } catch (err) {
      const e = err as AxiosError;
      this.logger.error(
        `SelectLine auth failed: ${e.message}`,
        e.response?.data as any,
      );
      throw err;
    }
  }

  private async request<T>(cfg: AxiosRequestConfig, retry = 1): Promise<T> {
    await this.authenticate();

    // attach auth header
    const headers = { ...(cfg.headers || {}) };
    const prefix = this.authPrefix?.trim();
    const value = prefix ? `${prefix} ${this.token}` : `${this.token}`;
    headers[this.authHeader] = value;

    try {
      const res = await firstValueFrom(
        this.http.request<T>({ timeout: 20_000, ...cfg, headers }),
      );
      return res.data;
    } catch (err) {
      const e = err as AxiosError;

      // retry on 401 (re-login once)
      if (e.response?.status === 401 && retry > 0) {
        this.token = null;
        return this.request<T>(cfg, retry - 1);
      }
      // basic backoff on rate-limit/transient
      if (
        (e.response?.status === 429 || e.response?.status === 503) &&
        retry > 0
      ) {
        await new Promise((r) => setTimeout(r, 1000));
        return this.request<T>(cfg, retry - 1);
      }

      this.logger.error(
        `SelectLine request failed ${cfg.method} ${cfg.url}: ${e.message}`,
        e.response?.data as any,
      );
      throw err;
    }
  }

  // ---------- Discovery endpoints (adjust paths/params to the real API) ----------

  async listArticleGroups(
    params: { page?: number; pageSize?: number; updatedSince?: string } = {},
  ) {
    const { page = 1, pageSize = 100, updatedSince } = params;
    const url = `${this.base}/slmobileApi/ArticleGroups`;
    const query: Record<string, string | number> = { page, pageSize };
    if (updatedSince) query['updated_since'] = updatedSince; // change name if needed

    return this.request<{
      items: any[];
      total?: number;
      page?: number;
      pageSize?: number;
    }>({
      method: 'GET',
      url,
      params: query,
    });
  }

  async listArticles(
    params: {
      page?: number;
      pageSize?: number;
      updatedSince?: string;
      groupId?: string;
    } = {},
  ) {
    const { page = 1, pageSize = 100, updatedSince, groupId } = params;
    const url = `${this.base}/slmobileApi/articles`;
    const query: Record<string, string | number> = { page, pageSize };
    if (updatedSince) query['updated_since'] = updatedSince;
    if (groupId) query['group_id'] = groupId;

    return this.request<{
      items: any[];
      total?: number;
      page?: number;
      pageSize?: number;
    }>({
      method: 'GET',
      url,
      params: query,
    });
  }

  /**
   * Fetch a single page of article groups.
   */
  async fetchArticleGroups(opts?: {
    page?: number;
    pageSize?: number;
  }): Promise<SlArticleGroup[]> {
    const url = new URL(`${this.base}${this.groupsPath}`);
    if (opts?.page !== undefined)
      url.searchParams.set('articleGroupListFilter.page', String(opts.page));
    if (opts?.pageSize !== undefined)
      url.searchParams.set(
        'articleGroupListFilter.items',
        String(opts.pageSize),
      );

    const res = await this.request<SlArticleGroupRaw[]>({
      method: 'GET',
      url: url.toString(),
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'identity',
      },
    });

    if (!Array.isArray(res)) {
      throw new Error('SelectLine groups: expected array');
    }

    return res.map((r) => this.normalizeGroup(r));
  }

  /**
   * Fetch ALL article groups by paging until the last page is short/empty.
   */
  async fetchAllArticleGroupsPaged(pageSize = 1000): Promise<SlArticleGroup[]> {
    let page = 1;
    const out: SlArticleGroup[] = [];
    const MAX_PAGES = 10000;

    while (page <= MAX_PAGES) {
      const batch = await this.fetchArticleGroups({ page, pageSize });
      out.push(...batch);
      if (!pageSize || batch.length < pageSize) break;
      page++;
    }
    return out;
  }
  /**
   * Fetch a single page of articles. If your server doesn't support paging,
   * it will just ignore the params and return the whole list.
   */
  async fetchArticles(opts?: {
    page?: number; // 1-based
    pageSize?: number; // e.g., 500 or 1000
    group?: string; // ArticleGroupNumber filter if your API supports it
  }): Promise<SlArticle[]> {
    const url = new URL(`${this.base}${this.articlesPath}`);
    if (opts?.page !== undefined)
      url.searchParams.set('articleListFilter.page', String(opts.page));
    if (opts?.pageSize !== undefined)
      url.searchParams.set('articleListFilter.items', String(opts.pageSize));
    if (opts?.group) url.searchParams.set('articleGroupNumber', opts.group);

    const res = await this.request<SlArticleRaw[]>({
      method: 'GET',
      url: url.toString(),
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'identity',
      },
    });

    if (!Array.isArray(res)) {
      throw new Error('SelectLine articles: expected array');
    }
    return res.map((r) => this.normalizeArticle(r));
  }

  /**
   * Fetch ALL articles by paging until the server returns a short page.
   * If the API doesn’t page, this will just do one request.
   */
  async fetchAllArticlesPaged(
    pageSize = 1000,
    group?: string,
  ): Promise<SlArticle[]> {
    let page = 1;
    const out: SlArticle[] = [];
    // safety cap to avoid infinite loops in case the server ignores paging
    const MAX_PAGES = 10000;

    while (page <= MAX_PAGES) {
      const batch = await this.fetchArticles({ page, pageSize, group });
      out.push(...batch);
      // stop when last page is short (or empty)
      if (!pageSize || batch.length < pageSize) break;
      page++;
    }
    return out;
  }
}
