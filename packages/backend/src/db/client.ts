import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js';
import { env } from '../config/env.js';

// Initialize libSQL client
const client = createClient({
  url: env.DATABASE_URL,
});

// Initialize Drizzle ORM
export const db = drizzle(client, { schema });

// Export types
export type Database = typeof db;
