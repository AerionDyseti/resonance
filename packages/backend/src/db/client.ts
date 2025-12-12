import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

// Initialize SQLite database
const sqlite = new Database(process.env.DATABASE_PATH || ':memory:');

// Enable foreign keys
sqlite.pragma('foreign_keys = ON');

// Initialize Drizzle ORM
export const db = drizzle(sqlite, { schema });

// Export types
export type Database = typeof db;
