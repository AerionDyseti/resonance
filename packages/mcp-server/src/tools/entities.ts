/**
 * Entity Tools for AIRP MCP Server
 *
 * Tools for querying and persisting entities.
 */

import type { FastMCP } from 'fastmcp';
import type { Database } from 'bun:sqlite';
import { z } from 'zod';
import type { EntityType } from '../types/entity.js';

// =============================================================================
// Zod Schemas for Tool Parameters
// =============================================================================

const EntityTypeSchema = z.enum([
  'character',
  'location',
  'organization',
  'event',
  'story',
  'item',
  'lore',
  'session',
  'ancestry',
  'culture',
  'scene',
  'misc',
  'chronicle',
]);

const GetEntityParams = z.object({
  id: z.string().describe('The entity ID (UUID)'),
});

const GetEntitiesParams = z.object({
  ids: z.array(z.string()).describe('Array of entity IDs to fetch'),
});

const ListEntitiesParams = z.object({
  chronicleId: z.string().describe('Chronicle ID to scope the query'),
  type: EntityTypeSchema.optional().describe('Filter by entity type'),
  limit: z.number().optional().default(50).describe('Maximum number of results'),
  offset: z.number().optional().default(0).describe('Offset for pagination'),
});

const PersistEntityParams = z.object({
  id: z.string().describe('Entity ID'),
  chronicleId: z.string().describe('Chronicle this entity belongs to'),
  type: EntityTypeSchema.describe('Entity type'),
  subtype: z.string().optional().describe('Optional subtype'),
  name: z.string().describe('Entity name'),
  summary: z.string().optional().describe('Brief summary'),
  body: z.string().optional().describe('Full description/content'),
  properties: z.record(z.unknown()).describe('Type-specific properties as JSON'),
});

const PersistEntitiesParams = z.object({
  entities: z.array(PersistEntityParams).describe('Array of entities to persist'),
});

const DeleteEntityParams = z.object({
  id: z.string().describe('Entity ID to delete'),
});

// =============================================================================
// Tool Registration
// =============================================================================

export function registerEntityTools(server: FastMCP, db: Database): void {
  // -------------------------------------------------------------------------
  // get_entity - Fetch a single entity by ID
  // -------------------------------------------------------------------------
  server.addTool({
    name: 'get_entity',
    description: 'Get a single entity by its ID. Returns the full entity with all properties.',
    parameters: GetEntityParams,
    execute: async (args) => {
      const row = db
        .prepare(
          `SELECT id, chronicle_id, type, subtype, name, summary, body, properties, created_at, updated_at
           FROM entities WHERE id = ?`
        )
        .get(args.id) as EntityRow | null;

      if (!row) {
        return JSON.stringify({ error: 'Entity not found', id: args.id });
      }

      return JSON.stringify(rowToEntity(row));
    },
  });

  // -------------------------------------------------------------------------
  // get_entities - Fetch multiple entities by IDs
  // -------------------------------------------------------------------------
  server.addTool({
    name: 'get_entities',
    description: 'Get multiple entities by their IDs. Useful for batch loading.',
    parameters: GetEntitiesParams,
    execute: async (args) => {
      if (args.ids.length === 0) {
        return JSON.stringify([]);
      }

      const placeholders = args.ids.map(() => '?').join(',');
      const rows = db
        .prepare(
          `SELECT id, chronicle_id, type, subtype, name, summary, body, properties, created_at, updated_at
           FROM entities WHERE id IN (${placeholders})`
        )
        .all(...args.ids) as EntityRow[];

      return JSON.stringify(rows.map(rowToEntity));
    },
  });

  // -------------------------------------------------------------------------
  // list_entities - List entities with filtering
  // -------------------------------------------------------------------------
  server.addTool({
    name: 'list_entities',
    description:
      'List entities in a chronicle, optionally filtered by type. Returns summaries, not full entities.',
    parameters: ListEntitiesParams,
    execute: async (args) => {
      let sql = `SELECT id, chronicle_id, type, subtype, name, summary
                 FROM entities WHERE chronicle_id = ?`;
      const params: (string | number)[] = [args.chronicleId];

      if (args.type) {
        sql += ` AND type = ?`;
        params.push(args.type);
      }

      sql += ` ORDER BY updated_at DESC LIMIT ? OFFSET ?`;
      params.push(args.limit ?? 50, args.offset ?? 0);

      const rows = db.prepare(sql).all(...params) as EntitySummaryRow[];

      return JSON.stringify(rows);
    },
  });

  // -------------------------------------------------------------------------
  // persist_entity - Create or update a single entity
  // -------------------------------------------------------------------------
  server.addTool({
    name: 'persist_entity',
    description:
      'Create or update a single entity. Uses upsert semantics - existing entities are updated.',
    parameters: PersistEntityParams,
    execute: async (args) => {
      const now = new Date().toISOString();

      db.prepare(
        `INSERT INTO entities (id, chronicle_id, type, subtype, name, summary, body, properties, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           chronicle_id = excluded.chronicle_id,
           type = excluded.type,
           subtype = excluded.subtype,
           name = excluded.name,
           summary = excluded.summary,
           body = excluded.body,
           properties = excluded.properties,
           updated_at = excluded.updated_at`
      ).run(
        args.id,
        args.chronicleId,
        args.type,
        args.subtype ?? null,
        args.name,
        args.summary ?? null,
        args.body ?? null,
        JSON.stringify(args.properties),
        now,
        now
      );

      return JSON.stringify({ success: true, id: args.id, updatedAt: now });
    },
  });

  // -------------------------------------------------------------------------
  // persist_entities - Batch create/update entities
  // -------------------------------------------------------------------------
  server.addTool({
    name: 'persist_entities',
    description:
      'Create or update multiple entities in a single transaction. More efficient for bulk operations.',
    parameters: PersistEntitiesParams,
    execute: async (args) => {
      const now = new Date().toISOString();
      const results: { id: string; success: boolean }[] = [];

      const stmt = db.prepare(
        `INSERT INTO entities (id, chronicle_id, type, subtype, name, summary, body, properties, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           chronicle_id = excluded.chronicle_id,
           type = excluded.type,
           subtype = excluded.subtype,
           name = excluded.name,
           summary = excluded.summary,
           body = excluded.body,
           properties = excluded.properties,
           updated_at = excluded.updated_at`
      );

      db.transaction(() => {
        for (const entity of args.entities) {
          stmt.run(
            entity.id,
            entity.chronicleId,
            entity.type,
            entity.subtype ?? null,
            entity.name,
            entity.summary ?? null,
            entity.body ?? null,
            JSON.stringify(entity.properties),
            now,
            now
          );
          results.push({ id: entity.id, success: true });
        }
      })();

      return JSON.stringify({ success: true, count: results.length, updatedAt: now });
    },
  });

  // -------------------------------------------------------------------------
  // delete_entity - Remove an entity
  // -------------------------------------------------------------------------
  server.addTool({
    name: 'delete_entity',
    description: 'Delete an entity by ID. This also removes it from the FTS index.',
    parameters: DeleteEntityParams,
    execute: async (args) => {
      const result = db.prepare('DELETE FROM entities WHERE id = ?').run(args.id);

      if (result.changes === 0) {
        return JSON.stringify({ success: false, error: 'Entity not found', id: args.id });
      }

      return JSON.stringify({ success: true, id: args.id });
    },
  });
}

// =============================================================================
// Helper Types and Functions
// =============================================================================

interface EntityRow {
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
}

interface EntitySummaryRow {
  id: string;
  chronicle_id: string;
  type: string;
  subtype: string | null;
  name: string;
  summary: string | null;
}

function rowToEntity(row: EntityRow) {
  return {
    id: row.id,
    chronicleId: row.chronicle_id,
    type: row.type as EntityType,
    subtype: row.subtype,
    name: row.name,
    summary: row.summary,
    body: row.body,
    properties: JSON.parse(row.properties),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
