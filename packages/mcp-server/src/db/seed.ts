/**
 * Database Seeding for AIRP MCP Server
 *
 * Seeds the lookup tables with default values.
 * Uses deterministic IDs so re-seeding is idempotent.
 */

import type { Database } from 'bun:sqlite';
import { ConnectionTypeId, CharacterCategoryId, OrganizationCategoryId } from '../types/ids.js';
import { DEFAULT_CONNECTION_TYPES } from '../types/connection-type.js';
import { DEFAULT_CHARACTER_CATEGORIES } from '../types/character-category.js';
import { DEFAULT_ORGANIZATION_CATEGORIES } from '../types/organization-category.js';

// =============================================================================
// Seeding Functions
// =============================================================================

/**
 * Seed all lookup tables with default values
 */
export function seedLookupTables(db: Database): void {
  const now = new Date().toISOString();

  db.transaction(() => {
    seedConnectionTypes(db, now);
    seedCharacterCategories(db, now);
    seedOrganizationCategories(db, now);
  })();
}

/**
 * Seed connection types
 */
function seedConnectionTypes(db: Database, timestamp: string): void {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO connection_types (id, name, description, category, suggested_inverse, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const type of DEFAULT_CONNECTION_TYPES) {
    // Use deterministic ID based on name
    const id = ConnectionTypeId(type.name);
    stmt.run(
      id,
      type.name,
      type.description,
      type.category ?? null,
      type.suggestedInverse ?? null,
      timestamp,
      timestamp
    );
  }
}

/**
 * Seed character categories
 */
function seedCharacterCategories(db: Database, timestamp: string): void {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO character_categories (id, name, description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const category of DEFAULT_CHARACTER_CATEGORIES) {
    // Use deterministic ID based on name
    const id = CharacterCategoryId(category.name);
    stmt.run(id, category.name, category.description, timestamp, timestamp);
  }
}

/**
 * Seed organization categories
 */
function seedOrganizationCategories(db: Database, timestamp: string): void {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO organization_categories (id, name, description, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const category of DEFAULT_ORGANIZATION_CATEGORIES) {
    // Use deterministic ID based on name
    const id = OrganizationCategoryId(category.name);
    stmt.run(id, category.name, category.description, timestamp, timestamp);
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Check if lookup tables are seeded
 */
export function areLookupTablesSeeded(db: Database): boolean {
  const result = db
    .prepare(
      `
    SELECT
      (SELECT COUNT(*) FROM connection_types) as connection_count,
      (SELECT COUNT(*) FROM character_categories) as character_count,
      (SELECT COUNT(*) FROM organization_categories) as organization_count
  `
    )
    .get() as { connection_count: number; character_count: number; organization_count: number };

  return result.connection_count > 0 && result.character_count > 0 && result.organization_count > 0;
}
