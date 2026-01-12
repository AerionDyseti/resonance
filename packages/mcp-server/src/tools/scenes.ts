/**
 * Scene Tools for AIRP MCP Server
 *
 * Tools for loading scene context to support the file-first workflow.
 */

import type { FastMCP } from 'fastmcp';
import type { Database } from 'bun:sqlite';
import { z } from 'zod';

// =============================================================================
// Zod Schemas for Tool Parameters
// =============================================================================

const LoadSceneContextParams = z.object({
  sceneId: z.string().describe('The active scene entity ID'),
  chronicleId: z.string().describe('Chronicle ID for scoping queries'),
  pcId: z.string().optional().describe('Player character ID for knowledge filtering'),
});

// =============================================================================
// Helper Types
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

interface ConnectionRow {
  id: string;
  source_id: string;
  target_id: string;
  description: string;
  facets: string;
  created_at: string;
  updated_at: string;
}

function rowToEntity(row: EntityRow) {
  return {
    id: row.id,
    chronicleId: row.chronicle_id,
    type: row.type,
    subtype: row.subtype,
    name: row.name,
    summary: row.summary,
    body: row.body,
    properties: JSON.parse(row.properties),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToConnection(row: ConnectionRow) {
  return {
    id: row.id,
    sourceId: row.source_id,
    targetId: row.target_id,
    description: row.description,
    facets: JSON.parse(row.facets),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// =============================================================================
// Tool Registration
// =============================================================================

export function registerSceneTools(server: FastMCP, db: Database): void {
  // -------------------------------------------------------------------------
  // load_scene_context - Bulk load everything needed for active play
  // -------------------------------------------------------------------------
  server.addTool({
    name: 'load_scene_context',
    description: `Load all context needed to play a scene. Returns:
- location: The Location entity where the scene takes place
- characters: All Character entities present (visible + hidden)
- connections: Relationships between present characters
- pcKnowledge: Connections where PC is source or target
- activeStories: Story entities with status='active' in this chronicle
- npcAgendas: Goals and secrets extracted from each NPC's properties

Use this at scene start to populate scene.json's context section.`,
    parameters: LoadSceneContextParams,
    execute: async (args) => {
      // 1. Get the Scene entity
      const sceneRow = db
        .prepare(
          `SELECT id, chronicle_id, type, subtype, name, summary, body, properties, created_at, updated_at
           FROM entities WHERE id = ? AND type = 'scene'`
        )
        .get(args.sceneId) as EntityRow | null;

      if (!sceneRow) {
        return JSON.stringify({ error: 'Scene not found', sceneId: args.sceneId });
      }

      const scene = rowToEntity(sceneRow);
      const sceneProps = scene.properties as {
        locationId?: string;
        presentCharacterIds?: string[];
        hiddenCharacterIds?: string[];
        pcId?: string;
      };

      // Use pcId from params, fall back to scene's pcId
      const pcId = args.pcId ?? sceneProps.pcId;

      // 2. Get the Location entity
      let location = null;
      if (sceneProps.locationId) {
        const locationRow = db
          .prepare(
            `SELECT id, chronicle_id, type, subtype, name, summary, body, properties, created_at, updated_at
             FROM entities WHERE id = ?`
          )
          .get(sceneProps.locationId) as EntityRow | null;

        if (locationRow) {
          location = rowToEntity(locationRow);
        }
      }

      // 3. Get all Character entities (present + hidden)
      const allCharacterIds = [
        ...(sceneProps.presentCharacterIds ?? []),
        ...(sceneProps.hiddenCharacterIds ?? []),
      ];

      let characters: ReturnType<typeof rowToEntity>[] = [];
      if (allCharacterIds.length > 0) {
        const placeholders = allCharacterIds.map(() => '?').join(',');
        const characterRows = db
          .prepare(
            `SELECT id, chronicle_id, type, subtype, name, summary, body, properties, created_at, updated_at
             FROM entities WHERE id IN (${placeholders})`
          )
          .all(...allCharacterIds) as EntityRow[];

        characters = characterRows.map(rowToEntity);
      }

      // 4. Get Connections between present characters
      let connections: ReturnType<typeof rowToConnection>[] = [];
      if (allCharacterIds.length > 1) {
        const placeholders = allCharacterIds.map(() => '?').join(',');
        const connectionRows = db
          .prepare(
            `SELECT id, source_id, target_id, description, facets, created_at, updated_at
             FROM connections
             WHERE source_id IN (${placeholders}) AND target_id IN (${placeholders})`
          )
          .all(...allCharacterIds, ...allCharacterIds) as ConnectionRow[];

        connections = connectionRows.map(rowToConnection);
      }

      // 5. Get PC Knowledge (connections where PC is source or target)
      let pcKnowledge: ReturnType<typeof rowToConnection>[] = [];
      if (pcId) {
        const knowledgeRows = db
          .prepare(
            `SELECT id, source_id, target_id, description, facets, created_at, updated_at
             FROM connections
             WHERE source_id = ? OR target_id = ?`
          )
          .all(pcId, pcId) as ConnectionRow[];

        pcKnowledge = knowledgeRows.map(rowToConnection);
      }

      // 6. Get Active Stories in this chronicle
      const storyRows = db
        .prepare(
          `SELECT id, chronicle_id, type, subtype, name, summary, body, properties, created_at, updated_at
           FROM entities
           WHERE chronicle_id = ? AND type = 'story'
             AND json_extract(properties, '$.status') = 'active'`
        )
        .all(args.chronicleId) as EntityRow[];

      const activeStories = storyRows.map(rowToEntity);

      // 7. Build NPC Agendas from character properties
      const npcAgendas = characters
        .filter((c) => c.id !== pcId) // Exclude PC
        .map((c) => {
          const props = c.properties as {
            goals?: string[];
            secrets?: string[];
          };
          return {
            characterId: c.id,
            name: c.name,
            goals: props.goals ?? [],
            secrets: props.secrets,
          };
        })
        .filter((agenda) => agenda.goals.length > 0 || agenda.secrets);

      return JSON.stringify({
        scene,
        location,
        characters,
        connections,
        pcKnowledge,
        activeStories,
        npcAgendas,
      });
    },
  });
}
