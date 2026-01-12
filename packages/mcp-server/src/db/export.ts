/**
 * Database Export Module for AIRP MCP Server
 *
 * Provides functionality to export database contents to JSON
 * for portability, backup, and debugging.
 */

import type { Database } from 'bun:sqlite';
import { writeFileSync, readFileSync } from 'fs';

// =============================================================================
// Types
// =============================================================================

export interface ExportedData {
  version: number;
  exportedAt: string;
  entities: EntityRow[];
  connections: ConnectionRow[];
  connectionTypes: LookupRow[];
  characterCategories: LookupRow[];
  organizationCategories: LookupRow[];
}

interface EntityRow {
  id: string;
  chronicle_id: string;
  type: string;
  subtype: string | null;
  name: string;
  summary: string | null;
  body: string | null;
  properties: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface ConnectionRow {
  id: string;
  source_id: string;
  target_id: string;
  description: string;
  facets: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface LookupRow {
  id: string;
  name: string;
  description: string;
  category?: string | null;
  suggested_inverse?: string | null;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// Export Functions
// =============================================================================

/**
 * Export all database contents to a JSON object
 */
export function exportDatabase(db: Database): ExportedData {
  // Parse JSON fields when selecting
  const entities = db.prepare('SELECT * FROM entities').all() as Array<{
    id: string;
    chronicle_id: string;
    type: string;
    subtype: string | null;
    name: string;
    summary: string | null;
    body: string | null;
    properties: string;
    created_at: string;
    updated_at: string;
  }>;

  const connections = db.prepare('SELECT * FROM connections').all() as Array<{
    id: string;
    source_id: string;
    target_id: string;
    description: string;
    facets: string;
    created_at: string;
    updated_at: string;
  }>;

  const connectionTypes = db.prepare('SELECT * FROM connection_types').all() as LookupRow[];
  const characterCategories = db.prepare('SELECT * FROM character_categories').all() as LookupRow[];
  const organizationCategories = db
    .prepare('SELECT * FROM organization_categories')
    .all() as LookupRow[];

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    entities: entities.map((e) => ({
      ...e,
      properties: JSON.parse(e.properties) as Record<string, unknown>,
    })),
    connections: connections.map((c) => ({
      ...c,
      facets: JSON.parse(c.facets) as Record<string, unknown>,
    })),
    connectionTypes,
    characterCategories,
    organizationCategories,
  };
}

/**
 * Export database to a JSON file
 */
export function exportDatabaseToFile(db: Database, filePath: string): void {
  const data = exportDatabase(db);
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Export a single chronicle's data
 */
export function exportChronicle(db: Database, chronicleId: string): ExportedData {
  // Get all entities for this chronicle
  const entities = db
    .prepare('SELECT * FROM entities WHERE chronicle_id = ?')
    .all(chronicleId) as Array<{
    id: string;
    chronicle_id: string;
    type: string;
    subtype: string | null;
    name: string;
    summary: string | null;
    body: string | null;
    properties: string;
    created_at: string;
    updated_at: string;
  }>;

  const entityIds = entities.map((e) => e.id);

  // Get connections where both source and target are in this chronicle
  const connections =
    entityIds.length > 0
      ? (db
          .prepare(
            `SELECT * FROM connections
           WHERE source_id IN (SELECT id FROM entities WHERE chronicle_id = ?)
             AND target_id IN (SELECT id FROM entities WHERE chronicle_id = ?)`
          )
          .all(chronicleId, chronicleId) as Array<{
          id: string;
          source_id: string;
          target_id: string;
          description: string;
          facets: string;
          created_at: string;
          updated_at: string;
        }>)
      : [];

  // Include lookup tables for completeness
  const connectionTypes = db.prepare('SELECT * FROM connection_types').all() as LookupRow[];
  const characterCategories = db.prepare('SELECT * FROM character_categories').all() as LookupRow[];
  const organizationCategories = db
    .prepare('SELECT * FROM organization_categories')
    .all() as LookupRow[];

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    entities: entities.map((e) => ({
      ...e,
      properties: JSON.parse(e.properties) as Record<string, unknown>,
    })),
    connections: connections.map((c) => ({
      ...c,
      facets: JSON.parse(c.facets) as Record<string, unknown>,
    })),
    connectionTypes,
    characterCategories,
    organizationCategories,
  };
}

// =============================================================================
// Import Functions
// =============================================================================

/**
 * Import data from an exported JSON object
 * Uses INSERT OR REPLACE to handle conflicts
 */
export function importDatabase(db: Database, data: ExportedData): void {
  db.transaction(() => {
    // Import lookup tables first (they're referenced by entities)
    const insertConnectionType = db.prepare(`
      INSERT OR REPLACE INTO connection_types (id, name, description, category, suggested_inverse, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const ct of data.connectionTypes) {
      insertConnectionType.run(
        ct.id,
        ct.name,
        ct.description,
        ct.category ?? null,
        ct.suggested_inverse ?? null,
        ct.created_at,
        ct.updated_at
      );
    }

    const insertCharacterCategory = db.prepare(`
      INSERT OR REPLACE INTO character_categories (id, name, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const cc of data.characterCategories) {
      insertCharacterCategory.run(cc.id, cc.name, cc.description, cc.created_at, cc.updated_at);
    }

    const insertOrganizationCategory = db.prepare(`
      INSERT OR REPLACE INTO organization_categories (id, name, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    for (const oc of data.organizationCategories) {
      insertOrganizationCategory.run(oc.id, oc.name, oc.description, oc.created_at, oc.updated_at);
    }

    // Import entities
    const insertEntity = db.prepare(`
      INSERT OR REPLACE INTO entities (id, chronicle_id, type, subtype, name, summary, body, properties, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const e of data.entities) {
      insertEntity.run(
        e.id,
        e.chronicle_id,
        e.type,
        e.subtype,
        e.name,
        e.summary,
        e.body,
        JSON.stringify(e.properties),
        e.created_at,
        e.updated_at
      );
    }

    // Import connections
    const insertConnection = db.prepare(`
      INSERT OR REPLACE INTO connections (id, source_id, target_id, description, facets, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    for (const c of data.connections) {
      insertConnection.run(
        c.id,
        c.source_id,
        c.target_id,
        c.description,
        JSON.stringify(c.facets),
        c.created_at,
        c.updated_at
      );
    }
  })();
}

/**
 * Import data from a JSON file
 */
export function importDatabaseFromFile(db: Database, filePath: string): void {
  const data = JSON.parse(readFileSync(filePath, 'utf-8')) as ExportedData;
  importDatabase(db, data);
}
