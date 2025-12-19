import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  PORT: z.string().default('3000').transform(Number).pipe(z.number().int().positive()),
});

type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

/**
 * Get validated environment variables
 * Caches result after first call
 */
export function getEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.flatten();
    // eslint-disable-next-line no-console
    console.error('Invalid environment variables:', errors.fieldErrors);
    // eslint-disable-next-line no-console
    console.error('Required fields:', Object.keys(envSchema.shape));
    throw new Error('Invalid environment variables');
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}
