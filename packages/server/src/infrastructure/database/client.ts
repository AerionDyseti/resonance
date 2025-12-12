import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from './schema';
import { env } from '../../config/env';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// Initialize Drizzle ORM
export const db = drizzle(pool, { schema });

// Export pool for raw queries if needed
export { pool };

// Export types
export type Database = typeof db;
