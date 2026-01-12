/**
 * Database Connection Module for AIRP MCP Server
 *
 * Handles:
 * - Database connection lifecycle
 * - Schema initialization and migrations
 * - Seeding default lookup tables
 */

import { Database } from 'bun:sqlite';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import {
  initializeSchema,
  getSchemaVersion,
  setSchemaVersion,
  CURRENT_SCHEMA_VERSION,
} from './schema.js';
import { seedLookupTables } from './seed.js';

// =============================================================================
// Types
// =============================================================================

export interface DatabaseConfig {
  /** Path to the database file. Use ':memory:' for in-memory database. */
  path: string;
  /** Skip seeding lookup tables (useful for testing) */
  skipSeed?: boolean;
}

// =============================================================================
// Connection Management
// =============================================================================

let _db: Database | null = null;

/**
 * Get the default database path
 * Uses XDG_DATA_HOME or falls back to ~/.local/share/resonance
 */
export function getDefaultDatabasePath(): string {
  const dataHome = process.env.XDG_DATA_HOME || join(process.env.HOME || '', '.local', 'share');
  const resonanceDir = join(dataHome, 'resonance');

  // Ensure directory exists
  if (!existsSync(resonanceDir)) {
    mkdirSync(resonanceDir, { recursive: true });
  }

  return join(resonanceDir, 'airp.db');
}

/**
 * Open a database connection
 *
 * @param config - Database configuration
 * @returns The database instance
 */
export function openDatabase(config: DatabaseConfig): Database {
  const db = new Database(config.path, { create: true });

  // Enable WAL mode for better concurrent access
  db.exec('PRAGMA journal_mode = WAL');

  // Check schema version and initialize/migrate as needed
  const currentVersion = getSchemaVersion(db);

  if (currentVersion < CURRENT_SCHEMA_VERSION) {
    initializeSchema(db);
    setSchemaVersion(db, CURRENT_SCHEMA_VERSION);

    // Seed default lookup tables on fresh database
    if (!config.skipSeed) {
      seedLookupTables(db);
    }
  }

  return db;
}

/**
 * Get or create the singleton database connection
 *
 * @param config - Optional configuration (only used on first call)
 * @returns The database instance
 */
export function getDatabase(config?: Partial<DatabaseConfig>): Database {
  if (!_db) {
    const fullConfig: DatabaseConfig = {
      path: config?.path ?? getDefaultDatabasePath(),
      skipSeed: config?.skipSeed ?? false,
    };
    _db = openDatabase(fullConfig);
  }
  return _db;
}

/**
 * Close the database connection
 */
export function closeDatabase(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}

/**
 * Create an in-memory database (useful for testing)
 */
export function createMemoryDatabase(skipSeed = false): Database {
  return openDatabase({ path: ':memory:', skipSeed });
}

// =============================================================================
// Transaction Helpers
// =============================================================================

/**
 * Run a function within a transaction
 *
 * @param db - The database instance
 * @param fn - The function to run
 * @returns The result of the function
 */
export function withTransaction<T>(db: Database, fn: () => T): T {
  return db.transaction(fn)();
}
