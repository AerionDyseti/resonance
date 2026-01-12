/**
 * Database Module for AIRP MCP Server
 *
 * Provides SQLite persistence with:
 * - Entity storage with JSON properties
 * - Connection/relationship storage
 * - FTS5 full-text search
 * - Prepared structure for vector embeddings
 * - Import/export for portability
 */

// Schema
export { initializeSchema, getSchemaDDL, CURRENT_SCHEMA_VERSION } from './schema.js';

// Connection management
export {
  openDatabase,
  getDatabase,
  closeDatabase,
  createMemoryDatabase,
  getDefaultDatabasePath,
  withTransaction,
  type DatabaseConfig,
} from './connection.js';

// Seeding
export { seedLookupTables, areLookupTablesSeeded } from './seed.js';

// Import/Export
export {
  exportDatabase,
  exportDatabaseToFile,
  exportChronicle,
  importDatabase,
  importDatabaseFromFile,
  type ExportedData,
} from './export.js';
