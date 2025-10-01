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

  // TLS toggles
  SELECTLINE_TLS_INSECURE: z.enum(['0', '1']).default('0'), // 1 ~ curl -k (dev only)
  SELECTLINE_CA_PATH: z.string().optional().or(z.literal('')),
  SELECTLINE_TLS_SKIP_HOSTNAME: z.enum(['0', '1']).default('0'),
  SELECTLINE_TLS_SERVERNAME: z.string().optional().or(z.literal('')),
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
