import { pgTable, text, timestamp, index, vector } from 'drizzle-orm/pg-core';

/**
 * Entities table - instances of entity definitions with property values
 * Maps to the Entity domain type
 */
export const entities = pgTable(
  'entities',
  {
    id: text('id').primaryKey(),
    worldId: text('world_id').notNull(),
    definitionId: text('definition_id').notNull(),
    name: text('name').notNull(),
    body: text('body').notNull().default(''), // Markdown content
    properties: text('properties').notNull().default('{}'), // JSON Record<string, PropertyValue>
    embedding: vector('embedding', { dimensions: 1536 }), // Vector embedding for semantic search
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    worldIdIdx: index('entities_world_id_idx').on(table.worldId),
    definitionIdIdx: index('entities_definition_id_idx').on(table.definitionId),
    nameIdx: index('entities_name_idx').on(table.name),
  })
);
