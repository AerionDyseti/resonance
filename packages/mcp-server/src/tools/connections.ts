/**
 * Connection Tools for AIRP MCP Server
 *
 * Tools for persisting and deleting connections between entities.
 */

import type { FastMCP } from 'fastmcp';
import type { Database } from 'bun:sqlite';
import { z } from 'zod';
import { ConnectionId } from '../types/ids.js';

// =============================================================================
// Zod Schemas for Tool Parameters
// =============================================================================

const ConnectionFacetSchema = z.object({
  description: z.string().optional(),
  degree: z.number().min(-5).max(5).optional(),
  establishedAt: z.string().optional(),
  lastUpdated: z.string().optional(),
});

const PersistConnectionParams = z.object({
  id: z.string().optional().describe('Connection ID. Generated if not provided.'),
  sourceId: z.string().describe('Source entity ID'),
  targetId: z.string().describe('Target entity ID'),
  description: z.string().describe('Semantic summary of the connection (for search)'),
  facets: z
    .record(ConnectionFacetSchema)
    .optional()
    .default({})
    .describe('Connection facets keyed by connection type'),
});

const DeleteConnectionParams = z
  .object({
    id: z.string().optional().describe('Connection ID to delete'),
    sourceId: z.string().optional().describe('Source entity ID (use with targetId)'),
    targetId: z.string().optional().describe('Target entity ID (use with sourceId)'),
  })
  .refine((data) => data.id || (data.sourceId && data.targetId), {
    message: 'Either id or both sourceId and targetId must be provided',
  });

// =============================================================================
// Tool Registration
// =============================================================================

export function registerConnectionTools(server: FastMCP, db: Database): void {
  // -------------------------------------------------------------------------
  // persist_connection - Create or update a connection
  // -------------------------------------------------------------------------
  server.addTool({
    name: 'persist_connection',
    description:
      'Create or update a connection between two entities. Uses upsert semantics — if a connection already exists between the source and target, it will be updated.',
    parameters: PersistConnectionParams,
    execute: async (args) => {
      const now = new Date().toISOString();
      const id = args.id ?? ConnectionId.random();

      // Validate source != target
      if (args.sourceId === args.targetId) {
        return JSON.stringify({
          success: false,
          error: 'Source and target must be different entities',
        });
      }

      db.prepare(
        `INSERT INTO connections (id, source_id, target_id, description, facets, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(source_id, target_id) DO UPDATE SET
           description = excluded.description,
           facets = excluded.facets,
           updated_at = excluded.updated_at`
      ).run(
        id,
        args.sourceId,
        args.targetId,
        args.description,
        JSON.stringify(args.facets ?? {}),
        now,
        now
      );

      // Fetch the actual connection to get the correct id (may differ if it was an update)
      const row = db
        .prepare(`SELECT id, updated_at FROM connections WHERE source_id = ? AND target_id = ?`)
        .get(args.sourceId, args.targetId) as { id: string; updated_at: string } | null;

      return JSON.stringify({
        success: true,
        id: row?.id ?? id,
        sourceId: args.sourceId,
        targetId: args.targetId,
        updatedAt: row?.updated_at ?? now,
      });
    },
  });

  // -------------------------------------------------------------------------
  // delete_connection - Remove a connection
  // -------------------------------------------------------------------------
  server.addTool({
    name: 'delete_connection',
    description:
      'Delete a connection by its ID, or by source/target entity pair. Use either id alone, or both sourceId and targetId.',
    parameters: DeleteConnectionParams,
    execute: async (args) => {
      let result: { changes: number };

      if (args.id) {
        result = db.prepare('DELETE FROM connections WHERE id = ?').run(args.id);
      } else {
        result = db
          .prepare('DELETE FROM connections WHERE source_id = ? AND target_id = ?')
          .run(args.sourceId!, args.targetId!);
      }

      if (result.changes === 0) {
        return JSON.stringify({
          success: false,
          error: 'Connection not found',
          ...(args.id ? { id: args.id } : { sourceId: args.sourceId, targetId: args.targetId }),
        });
      }

      return JSON.stringify({
        success: true,
        ...(args.id ? { id: args.id } : { sourceId: args.sourceId, targetId: args.targetId }),
      });
    },
  });
}
