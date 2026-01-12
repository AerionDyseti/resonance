/**
 * SQLite Database Schema for AIRP MCP Server
 *
 * Uses bun:sqlite with:
 * - JSON columns for flexible entity properties
 * - FTS5 for full-text search
 * - Prepared structure for sqlite-vec embeddings
 *
 * Design principles:
 * - Single `entities` table with type discrimination (no table-per-type)
 * - Properties stored as JSON for flexibility
 * - Indexed columns for common query patterns (chronicleId, type, updatedAt)
 * - FTS5 for text search across name, summary, body
 */

import type { Database } from 'bun:sqlite';

// =============================================================================
// Schema Definitions (SQL strings)
// =============================================================================

/**
 * Main entities table
 * Stores all entity types with JSON properties
 */
const CREATE_ENTITIES_TABLE = `
CREATE TABLE IF NOT EXISTS entities (
  id TEXT PRIMARY KEY,
  chronicle_id TEXT NOT NULL,
  type TEXT NOT NULL,
  subtype TEXT,
  name TEXT NOT NULL,
  summary TEXT,
  body TEXT,
  properties TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)`;

const CREATE_ENTITIES_INDEXES = [
  `CREATE INDEX IF NOT EXISTS idx_entities_chronicle_id ON entities(chronicle_id)`,
  `CREATE INDEX IF NOT EXISTS idx_entities_type ON entities(type)`,
  `CREATE INDEX IF NOT EXISTS idx_entities_chronicle_type ON entities(chronicle_id, type)`,
  `CREATE INDEX IF NOT EXISTS idx_entities_updated_at ON entities(updated_at)`,
  `CREATE INDEX IF NOT EXISTS idx_entities_name ON entities(name)`,
];

/**
 * Connections table
 * Stores directed relationships between entities
 */
const CREATE_CONNECTIONS_TABLE = `
CREATE TABLE IF NOT EXISTS connections (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  description TEXT NOT NULL,
  facets TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(source_id, target_id)
)`;

const CREATE_CONNECTIONS_INDEXES = [
  `CREATE INDEX IF NOT EXISTS idx_connections_source_id ON connections(source_id)`,
  `CREATE INDEX IF NOT EXISTS idx_connections_target_id ON connections(target_id)`,
  `CREATE INDEX IF NOT EXISTS idx_connections_updated_at ON connections(updated_at)`,
];

/**
 * Connection types lookup table
 */
const CREATE_CONNECTION_TYPES_TABLE = `
CREATE TABLE IF NOT EXISTS connection_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT,
  suggested_inverse TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)`;

/**
 * Character categories lookup table
 */
const CREATE_CHARACTER_CATEGORIES_TABLE = `
CREATE TABLE IF NOT EXISTS character_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)`;

/**
 * Organization categories lookup table
 */
const CREATE_ORGANIZATION_CATEGORIES_TABLE = `
CREATE TABLE IF NOT EXISTS organization_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)`;

/**
 * FTS5 virtual table for full-text search
 * Indexes name, summary, and body fields from entities
 */
const CREATE_ENTITIES_FTS = `
CREATE VIRTUAL TABLE IF NOT EXISTS entities_fts USING fts5(
  name,
  summary,
  body,
  content='entities',
  content_rowid='rowid'
)`;

/**
 * Triggers to keep FTS index in sync with entities table
 */
const CREATE_FTS_TRIGGERS = [
  `CREATE TRIGGER IF NOT EXISTS entities_ai AFTER INSERT ON entities BEGIN
    INSERT INTO entities_fts(rowid, name, summary, body)
    VALUES (new.rowid, new.name, new.summary, new.body);
  END`,
  `CREATE TRIGGER IF NOT EXISTS entities_ad AFTER DELETE ON entities BEGIN
    INSERT INTO entities_fts(entities_fts, rowid, name, summary, body)
    VALUES('delete', old.rowid, old.name, old.summary, old.body);
  END`,
  `CREATE TRIGGER IF NOT EXISTS entities_au AFTER UPDATE ON entities BEGIN
    INSERT INTO entities_fts(entities_fts, rowid, name, summary, body)
    VALUES('delete', old.rowid, old.name, old.summary, old.body);
    INSERT INTO entities_fts(rowid, name, summary, body)
    VALUES (new.rowid, new.name, new.summary, new.body);
  END`,
];

/**
 * Entity embeddings table (prepared for sqlite-vec)
 *
 * This table stores vector embeddings for semantic search.
 * The actual vector column will be added when sqlite-vec is loaded.
 * For now, we store metadata and a placeholder for the embedding.
 */
const CREATE_ENTITY_EMBEDDINGS_TABLE = `
CREATE TABLE IF NOT EXISTS entity_embeddings (
  id INTEGER PRIMARY KEY,
  entity_id TEXT NOT NULL UNIQUE,
  text_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (entity_id) REFERENCES entities(id) ON DELETE CASCADE
)`;

/**
 * Connection embeddings table (prepared for sqlite-vec)
 */
const CREATE_CONNECTION_EMBEDDINGS_TABLE = `
CREATE TABLE IF NOT EXISTS connection_embeddings (
  id INTEGER PRIMARY KEY,
  connection_id TEXT NOT NULL UNIQUE,
  text_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (connection_id) REFERENCES connections(id) ON DELETE CASCADE
)`;

// =============================================================================
// Schema Initialization
// =============================================================================

/**
 * Initialize the database schema
 * Creates all tables, indexes, and triggers if they don't exist
 */
export function initializeSchema(db: Database): void {
  // Enable foreign keys
  db.exec('PRAGMA foreign_keys = ON');

  // Create tables in a transaction
  db.transaction(() => {
    // Core tables
    db.exec(CREATE_ENTITIES_TABLE);
    db.exec(CREATE_CONNECTIONS_TABLE);

    // Lookup tables
    db.exec(CREATE_CONNECTION_TYPES_TABLE);
    db.exec(CREATE_CHARACTER_CATEGORIES_TABLE);
    db.exec(CREATE_ORGANIZATION_CATEGORIES_TABLE);

    // Indexes
    for (const index of CREATE_ENTITIES_INDEXES) {
      db.exec(index);
    }
    for (const index of CREATE_CONNECTIONS_INDEXES) {
      db.exec(index);
    }

    // FTS5 for full-text search
    db.exec(CREATE_ENTITIES_FTS);
    for (const trigger of CREATE_FTS_TRIGGERS) {
      db.exec(trigger);
    }

    // Embedding tables (prepared for sqlite-vec)
    db.exec(CREATE_ENTITY_EMBEDDINGS_TABLE);
    db.exec(CREATE_CONNECTION_EMBEDDINGS_TABLE);
  })();
}

/**
 * Get schema version (for future migrations)
 * Returns 1 for the initial schema
 */
export function getSchemaVersion(db: Database): number {
  const result = db.prepare('PRAGMA user_version').get() as { user_version: number } | null;
  return result?.user_version ?? 0;
}

/**
 * Set schema version
 */
export function setSchemaVersion(db: Database, version: number): void {
  db.exec(`PRAGMA user_version = ${version}`);
}

/**
 * Current schema version
 */
export const CURRENT_SCHEMA_VERSION = 1;

// =============================================================================
// Export Schema SQL (for portability/inspection)
// =============================================================================

/**
 * Get all schema DDL statements
 * Useful for exporting or inspecting the schema
 */
export function getSchemaDDL(): string[] {
  return [
    CREATE_ENTITIES_TABLE,
    ...CREATE_ENTITIES_INDEXES,
    CREATE_CONNECTIONS_TABLE,
    ...CREATE_CONNECTIONS_INDEXES,
    CREATE_CONNECTION_TYPES_TABLE,
    CREATE_CHARACTER_CATEGORIES_TABLE,
    CREATE_ORGANIZATION_CATEGORIES_TABLE,
    CREATE_ENTITIES_FTS,
    ...CREATE_FTS_TRIGGERS,
    CREATE_ENTITY_EMBEDDINGS_TABLE,
    CREATE_CONNECTION_EMBEDDINGS_TABLE,
  ];
}
