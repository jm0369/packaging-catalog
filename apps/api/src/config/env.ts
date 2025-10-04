import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default('3001'),

  // CORS for web/admin
  CORS_ORIGIN: z.string().optional(),

  // SelectLine
  SELECTLINE_BASE: z.string().url(),
  SELECTLINE_LOGIN_PATH: z.string().default('/slmobileApi/Login'),
  SELECTLINE_GROUPS_PATH: z.string().default('/slmobileApi/ArticleGroups'),
  SELECTLINE_ARTICLES_PATH: z.string().default('/slmobileApi/Articles'),
  SELECTLINE_MACRO_ARTICLE_BY_NUMBER_PATH: z.string().default('/Macros/GetArticleByNumber'),
  SELECTLINE_USERNAME: z.string(),
  SELECTLINE_PASSWORD: z.string(),
  SELECTLINE_APPKEY: z.string().default('Website-PC'),
  SELECTLINE_TLS_INSECURE: z.enum(['0', '1']).default('0'),

  // Admin auth (shared header)
  ADMIN_SHARED_SECRET: z.string().min(6),

  // S3 / R2
  S3_REGION: z.string(),
  S3_BUCKET: z.string(),
  S3_ENDPOINT: z.string().url(),
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  PUBLIC_CDN_BASE: z.string().url(), // e.g. https://pub-xxxxx.r2.dev

  // Prisma (standard DATABASE_URL from root .env)
  DATABASE_URL: z.string().url(),
});

export type Env = z.infer<typeof EnvSchema>;

export function validateEnv(input: Record<string, unknown> = process.env): Env {
  const parsed = EnvSchema.safeParse(input);
  if (!parsed.success) {
    // eslint-disable-next-line no-console
    console.error('Invalid environment:', parsed.error.flatten());
    process.exit(1);
  }
  return parsed.data;
}

export const getEnv = () => validateEnv(process.env as any);