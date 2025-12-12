import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';

/**
 * Relationships table - typed connections between entities
 * Maps to the Relationship domain type
 */
export const relationships = pgTable(
  'relationships',
  {
    id: text('id').primaryKey(),
    worldId: text('world_id').notNull(),
    fromEntityId: text('from_entity_id').notNull(),
    toEntityId: text('to_entity_id').notNull(),
    type: text('type').notNull(), // e.g., "parent", "ally", "enemy"
    description: text('description'),
    metadata: text('metadata'), // JSON Record<string, unknown>
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    worldIdIdx: index('relationships_world_id_idx').on(table.worldId),
    fromEntityIdIdx: index('relationships_from_entity_id_idx').on(table.fromEntityId),
    toEntityIdIdx: index('relationships_to_entity_id_idx').on(table.toEntityId),
    typeIdx: index('relationships_type_idx').on(table.type),
  })
);
