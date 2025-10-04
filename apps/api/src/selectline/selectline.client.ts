import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { getEnv } from '../config/env';
import {
  MacroColumnResponse,
  SlArticle,
  SlArticleGroup,
  SlArticleGroupRaw,
  SlArticleRaw,
} from './selectline.types.js';

@Injectable()
export class SelectLineClient {
  private readonly log = new Logger(SelectLineClient.name);
  private readonly env = getEnv();
  private token: string | null = null;
  private tokenExp: number = 0;

  constructor(private readonly http: HttpService) {}

  private base() {
    return this.env.SELECTLINE_BASE.replace(/\/+$/, '');
  }

  private async login() {
    if (this.token && Date.now() < this.tokenExp - 10_000) {
      this.log.log('Using cached token');
      return;
    }

    const url = `${this.base()}${this.env.SELECTLINE_LOGIN_PATH}`;
    const body = {
      UserName: this.env.SELECTLINE_USERNAME,
      Password: this.env.SELECTLINE_PASSWORD,
      AppKey: this.env.SELECTLINE_APPKEY,
    };
    this.log.log(`Attempting login to ${url}`);
    const res = await firstValueFrom(this.http.post(url, body, {
      headers: { 'Content-Type': 'application/json' },
      // Allow self-signed if enabled via NODE_TLS_REJECT_UNAUTHORIZED
      validateStatus: () => true,
    }));

    const data: any = res.data ?? {};
    const token =
      data.AccessToken ?? data.token ?? data.access_token ?? null;
    const expires =
      Number(data.ExpiresInSeconds ?? data.expires_in ?? 3600);

    if (!token) {
      this.log.error(`Login failed ${res.status}: ${JSON.stringify(data).slice(0, 500)}`);
      throw new Error('SelectLine login failed');
    }
    this.log.log(`Login successful, token expires in ${expires}s`);
    this.token = token;
    this.tokenExp = Date.now() + expires * 1000;
  }

  private async request<T = unknown>(method: 'GET'|'POST', path: string, payload?: unknown): Promise<T> {
    await this.login();
    const url = `${this.base()}${path}`;
    this.log.log(`Request ${method} ${path} with token: ${this.token?.substring(0, 20)}...`);
    const res = await firstValueFrom(this.http.request({
      method,
      url,
      headers: {
        Accept: 'application/json',
        Authorization: `LoginId ${this.token}`, // SelectLine uses "LoginId {token}" format
      },
      data: payload ?? undefined,
      validateStatus: () => true,
    }));
    if (res.status >= 200 && res.status < 300) {
      return res.data as T;
    }
    const trimmed = typeof res.data === 'string' ? res.data.slice(0, 500) : JSON.stringify(res.data ?? '').slice(0, 500);
    this.log.warn(`HTTP ${res.status} ${path} — ${trimmed}`);
    throw new Error(`SelectLine ${path} => ${res.status}`);
  }

  // ---- Groups ----
  async fetchGroups(page?: number, items?: number): Promise<SlArticleGroup[]> {
    const url = new URL(`${this.base()}${this.env.SELECTLINE_GROUPS_PATH}`);
    if (page) url.searchParams.set('page', String(page));
    if (items) url.searchParams.set('items', String(items));

    const raw = await this.request<SlArticleGroupRaw[]>('GET', url.pathname + (url.search || ''));
    if (!Array.isArray(raw)) return [];

    return raw.map((g) => ({
      id: g.Number,
      name: g.Description,
      description: g.AdditionalDescription,
      parentId: g.ParentArticleGroupNumber,
      sortOrder: g.ShopPosition,
    }));
  }

  // ---- Articles (paged) ----
  async fetchArticles(page?: number, items?: number, group?: string): Promise<SlArticle[]> {
    const url = new URL(`${this.base()}${this.env.SELECTLINE_ARTICLES_PATH}`);
    if (page) url.searchParams.set('articleListFilter.page', String(page));
    if (items) url.searchParams.set('articleListFilter.items', String(items));
    if (group) url.searchParams.set('articleGroupNumber', group);

    const raw = await this.request<SlArticleRaw[]>('GET', url.pathname + (url.search || ''));
    if (!Array.isArray(raw)) return [];

    return raw.map((r) => ({
      externalId: r.Number,
      groupExternalId: r.ArticleGroupNumber,
      sku: r.Number,
      ean: r.EuropeanArticleNumber ?? null,
      title: r.Name,
      description: r.Description ?? r.AdditionalDescription ?? null,
      uom: r.QuantityUnit ?? null,
      updatedAt: r.MetaData?.ModificationDate ?? null,
      attributes: null, // filled by macro (on-demand or in sync)
    }));
  }

  // ---- Macro: GetArticleByNumber ----
  async fetchArticleMacro(number: string): Promise<Record<string, unknown> | null> {
    const path = this.env.SELECTLINE_MACRO_ARTICLE_BY_NUMBER_PATH;
    const payload = [{ Name: 'ArtikelNr', Value: number }];
    const data = await this.request<MacroColumnResponse>('POST', path, payload);
    if (!data?.Rows?.length || !data.ColumnNames?.length) return null;

    const cols = data.ColumnNames;
    const first = data.Rows[0]?.ColumnValues ?? [];
    const obj: Record<string, unknown> = {};
    cols.forEach((c, i) => (obj[c] = first[i]));
    return obj;
  }
}