import { z } from 'zod';

export const envSchema = z.object({
  // Server
  PORT: z.coerce.number().default(3001),

  // SelectLine auth & base
  SELECTLINE_BASE_URL: z.string().url(), // e.g. https://5.149.225.177:444
  SELECTLINE_AUTH_PATH: z.string().default('/slmobileApi/Login'),
  SELECTLINE_GROUPS_PATH: z.string().default('/slmobileApi/ArticleGroups'),
  SELECTLINE_ARTICLES_PATH: z.string().default('/slmobileApi/Articles'),
  SELECTLINE_USERNAME: z.string().min(1),
  SELECTLINE_PASSWORD: z.string().min(1),
  SELECTLINE_APPKEY: z.string().min(1),
  CORS_ORIGIN: z.string().url().optional().or(z.literal('')),

  // TLS toggles
  SELECTLINE_TLS_INSECURE: z.enum(['0', '1']).default('0'), // 1 ~ curl -k (dev only)
  SELECTLINE_CA_PATH: z.string().optional().or(z.literal('')),
  SELECTLINE_TLS_SKIP_HOSTNAME: z.enum(['0', '1']).default('0'),
  SELECTLINE_TLS_SERVERNAME: z.string().optional().or(z.literal('')),

  S3_ENDPOINT: z.string().url().optional(), // S3-compatible (R2 if set)
  S3_REGION: z.string(),
  S3_BUCKET: z.string(),
  S3_ACCESS_KEY_ID: z.string(),
  S3_SECRET_ACCESS_KEY: z.string(),
  PUBLIC_CDN_BASE: z.string().url(),
  ADMIN_SHARED_SECRET: z.string().min(8),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    // pretty print & exit
    console.error(
      '❌ Invalid environment configuration:\n',
      parsed.error.format(),
    );
    process.exit(1);
  }
  return parsed.data;
}
