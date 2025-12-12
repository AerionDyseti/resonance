import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js';

// Initialize libSQL client
const client = createClient({
  url: process.env.DATABASE_URL || 'file:local.db',
});

// Initialize Drizzle ORM
export const db = drizzle(client, { schema });

// Export types
export type Database = typeof db;
