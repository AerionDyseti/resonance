import { env } from './env';

/**
 * Database configuration derived from environment variables
 */
export const databaseConfig = {
  url: env.DATABASE_URL,

  // Connection pool settings (sensible defaults for development)
  pool: {
    min: env.NODE_ENV === 'production' ? 2 : 1,
    max: env.NODE_ENV === 'production' ? 10 : 5,
  },

  // SSL configuration
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
} as const;

export type DatabaseConfig = typeof databaseConfig;
