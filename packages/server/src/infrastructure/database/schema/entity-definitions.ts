import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';

/**
 * Entity definitions table - schema definitions for entities
 * Maps to the EntityDefinition domain type
 */
export const entityDefinitions = pgTable(
  'entity_definitions',
  {
    id: text('id').primaryKey(),
    worldId: text('world_id').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    icon: text('icon'),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    worldIdIdx: index('entity_definitions_world_id_idx').on(table.worldId),
    nameIdx: index('entity_definitions_name_idx').on(table.name),
  })
);
