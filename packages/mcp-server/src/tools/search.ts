/**
 * Search Tools for AIRP MCP Server
 *
 * Full-text search and filtered queries using FTS5.
 */

import type { FastMCP } from 'fastmcp';
import type { Database } from 'bun:sqlite';
import { z } from 'zod';

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

const SearchEntitiesParams = z.object({
  query: z.string().describe('Search query (searches name, summary, and body)'),
  chronicleId: z.string().optional().describe('Optional: scope search to a specific chronicle'),
  type: EntityTypeSchema.optional().describe('Optional: filter by entity type'),
  limit: z.number().optional().default(20).describe('Maximum number of results'),
});

const FindByNameParams = z.object({
  name: z.string().describe('Name to search for (case-insensitive, partial match)'),
  chronicleId: z.string().optional().describe('Optional: scope search to a specific chronicle'),
  type: EntityTypeSchema.optional().describe('Optional: filter by entity type'),
  limit: z.number().optional().default(20).describe('Maximum number of results'),
});

const GetConnectionsParams = z.object({
  entityId: z.string().describe('Entity ID to get connections for'),
  direction: z
    .enum(['outgoing', 'incoming', 'both'])
    .optional()
    .default('both')
    .describe('Direction of connections to retrieve'),
  limit: z.number().optional().default(50).describe('Maximum number of results'),
});

const SearchConnectionsParams = z.object({
  query: z.string().describe('Search query for connection descriptions'),
  chronicleId: z.string().optional().describe('Optional: scope to entities in a chronicle'),
  limit: z.number().optional().default(20).describe('Maximum number of results'),
});

// =============================================================================
// Tool Registration
// =============================================================================

export function registerSearchTools(server: FastMCP, db: Database): void {
  // -------------------------------------------------------------------------
  // search_entities - Full-text search across entities
  // -------------------------------------------------------------------------
  server.addTool({
    name: 'search_entities',
    description:
      'Full-text search across entity names, summaries, and bodies. Uses FTS5 for fast matching.',
    parameters: SearchEntitiesParams,
    execute: async (args) => {
      // Build FTS5 query - escape special characters
      const ftsQuery = escapeFtsQuery(args.query);

      let sql = `
        SELECT e.id, e.chronicle_id, e.type, e.subtype, e.name, e.summary,
               bm25(entities_fts) as rank
        FROM entities_fts fts
        JOIN entities e ON e.rowid = fts.rowid
        WHERE entities_fts MATCH ?
      `;
      const params: (string | number)[] = [ftsQuery];

      if (args.chronicleId) {
        sql += ` AND e.chronicle_id = ?`;
        params.push(args.chronicleId);
      }

      if (args.type) {
        sql += ` AND e.type = ?`;
        params.push(args.type);
      }

      sql += ` ORDER BY rank LIMIT ?`;
      params.push(args.limit ?? 20);

      const rows = db.prepare(sql).all(...params) as SearchResultRow[];

      return JSON.stringify(
        rows.map((row) => ({
          id: row.id,
          chronicleId: row.chronicle_id,
          type: row.type,
          subtype: row.subtype,
          name: row.name,
          summary: row.summary,
          relevance: -row.rank, // BM25 returns negative scores, lower is better
        }))
      );
    },
  });

  // -------------------------------------------------------------------------
  // find_by_name - Quick name lookup
  // -------------------------------------------------------------------------
  server.addTool({
    name: 'find_by_name',
    description:
      'Find entities by name (case-insensitive partial match). Faster than full-text search for simple name lookups.',
    parameters: FindByNameParams,
    execute: async (args) => {
      let sql = `
        SELECT id, chronicle_id, type, subtype, name, summary
        FROM entities
        WHERE name LIKE ?
      `;
      const params: (string | number)[] = [`%${args.name}%`];

      if (args.chronicleId) {
        sql += ` AND chronicle_id = ?`;
        params.push(args.chronicleId);
      }

      if (args.type) {
        sql += ` AND type = ?`;
        params.push(args.type);
      }

      sql += ` ORDER BY name LIMIT ?`;
      params.push(args.limit ?? 20);

      const rows = db.prepare(sql).all(...params) as EntitySummaryRow[];

      return JSON.stringify(
        rows.map((row) => ({
          id: row.id,
          chronicleId: row.chronicle_id,
          type: row.type,
          subtype: row.subtype,
          name: row.name,
          summary: row.summary,
        }))
      );
    },
  });

  // -------------------------------------------------------------------------
  // get_connections - Get connections for an entity
  // -------------------------------------------------------------------------
  server.addTool({
    name: 'get_connections',
    description:
      'Get connections for an entity. Can retrieve outgoing, incoming, or both directions.',
    parameters: GetConnectionsParams,
    execute: async (args) => {
      const results: ConnectionRow[] = [];

      if (args.direction === 'outgoing' || args.direction === 'both') {
        const outgoing = db
          .prepare(
            `SELECT id, source_id, target_id, description, facets, created_at, updated_at
             FROM connections WHERE source_id = ? LIMIT ?`
          )
          .all(args.entityId, args.limit ?? 50) as ConnectionRow[];
        results.push(...outgoing);
      }

      if (args.direction === 'incoming' || args.direction === 'both') {
        const remaining = (args.limit ?? 50) - results.length;
        if (remaining > 0) {
          const incoming = db
            .prepare(
              `SELECT id, source_id, target_id, description, facets, created_at, updated_at
               FROM connections WHERE target_id = ? LIMIT ?`
            )
            .all(args.entityId, remaining) as ConnectionRow[];
          results.push(...incoming);
        }
      }

      return JSON.stringify(
        results.map((row) => ({
          id: row.id,
          sourceId: row.source_id,
          targetId: row.target_id,
          description: row.description,
          facets: JSON.parse(row.facets),
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }))
      );
    },
  });

  // -------------------------------------------------------------------------
  // search_connections - Search connection descriptions
  // -------------------------------------------------------------------------
  server.addTool({
    name: 'search_connections',
    description: 'Search connections by their description text.',
    parameters: SearchConnectionsParams,
    execute: async (args) => {
      let sql = `
        SELECT c.id, c.source_id, c.target_id, c.description, c.facets
        FROM connections c
        WHERE c.description LIKE ?
      `;
      const params: (string | number)[] = [`%${args.query}%`];

      // If chronicleId provided, only return connections between entities in that chronicle
      if (args.chronicleId) {
        sql = `
          SELECT c.id, c.source_id, c.target_id, c.description, c.facets
          FROM connections c
          JOIN entities e1 ON c.source_id = e1.id
          JOIN entities e2 ON c.target_id = e2.id
          WHERE c.description LIKE ?
            AND e1.chronicle_id = ?
            AND e2.chronicle_id = ?
        `;
        params.push(args.chronicleId, args.chronicleId);
      }

      sql += ` LIMIT ?`;
      params.push(args.limit ?? 20);

      const rows = db.prepare(sql).all(...params) as ConnectionRow[];

      return JSON.stringify(
        rows.map((row) => ({
          id: row.id,
          sourceId: row.source_id,
          targetId: row.target_id,
          description: row.description,
          facets: JSON.parse(row.facets),
        }))
      );
    },
  });

  // -------------------------------------------------------------------------
  // get_lookup_types - Get available lookup table values
  // -------------------------------------------------------------------------
  server.addTool({
    name: 'get_lookup_types',
    description:
      'Get available values from lookup tables (connection_types, character_categories, organization_categories). Useful for maintaining consistency.',
    parameters: z.object({
      table: z
        .enum(['connection_types', 'character_categories', 'organization_categories'])
        .describe('Which lookup table to query'),
    }),
    execute: async (args) => {
      const rows = db
        .prepare(`SELECT id, name, description FROM ${args.table} ORDER BY name`)
        .all() as { id: string; name: string; description: string }[];

      return JSON.stringify(rows);
    },
  });
}

// =============================================================================
// Helper Types and Functions
// =============================================================================

interface SearchResultRow {
  id: string;
  chronicle_id: string;
  type: string;
  subtype: string | null;
  name: string;
  summary: string | null;
  rank: number;
}

interface EntitySummaryRow {
  id: string;
  chronicle_id: string;
  type: string;
  subtype: string | null;
  name: string;
  summary: string | null;
}

interface ConnectionRow {
  id: string;
  source_id: string;
  target_id: string;
  description: string;
  facets: string;
  created_at: string;
  updated_at: string;
}

/**
 * Escape special FTS5 characters in a query string.
 * FTS5 uses: AND OR NOT ( ) " * ^
 */
function escapeFtsQuery(query: string): string {
  // Wrap each word in quotes to treat as literal, handle phrases
  return query
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map((word) => `"${word.replace(/"/g, '""')}"`)
    .join(' ');
}
