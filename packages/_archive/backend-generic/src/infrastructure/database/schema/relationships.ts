import { pgTable, uuid, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { worlds } from './worlds';
import { entities } from './entities';
import { relationshipDefinitions } from './relationship-definitions';
import type { PropertyJson } from './entities';

/**
 * Relationships table - entity connections
 * Represents edges in the knowledge graph between entities
 */
export const relationships = pgTable(
  'relationships',
  {
    id: uuid('id').primaryKey(),
    worldId: uuid('world_id')
      .notNull()
      .references(() => worlds.id, { onDelete: 'cascade' }),
    definitionId: uuid('definition_id')
      .notNull()
      .references(() => relationshipDefinitions.id),
    sourceEntityId: uuid('source_entity_id')
      .notNull()
      .references(() => entities.id, { onDelete: 'cascade' }),
    targetEntityId: uuid('target_entity_id')
      .notNull()
      .references(() => entities.id, { onDelete: 'cascade' }),
    // Properties on the relationship itself
    properties: jsonb('properties').$type<PropertyJson[]>().notNull().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Indexes for efficient graph traversal
    index('relationships_source_idx').on(table.sourceEntityId),
    index('relationships_target_idx').on(table.targetEntityId),
    index('relationships_world_idx').on(table.worldId),
  ]
);

export type RelationshipRow = typeof relationships.$inferSelect;
export type NewRelationshipRow = typeof relationships.$inferInsert;
