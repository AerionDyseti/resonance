import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { databaseConfig } from '../config/database.config';
import * as schema from './schema/index';

const { Pool } = pg;

/**
 * PostgreSQL connection pool
 * Configured based on environment (development/production)
 */
const pool = new Pool({
  connectionString: databaseConfig.url,
  min: databaseConfig.pool.min,
  max: databaseConfig.pool.max,
  ssl: databaseConfig.ssl,
});

/**
 * Drizzle ORM instance with full schema
 * Use this for all database operations
 */
export const db = drizzle(pool, { schema });

/**
 * Type alias for the database instance
 * Useful for dependency injection and testing
 */
export type Database = typeof db;

/**
 * Close the database connection pool
 * Call this during graceful shutdown
 */
export async function closeDatabase(): Promise<void> {
  await pool.end();
}
