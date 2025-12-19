import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { worlds } from './worlds';

/**
 * Entity definitions table - schema types for entities
 * Defines what kinds of entities can exist in a world (Character, Location, etc.)
 */
export const entityDefinitions = pgTable('entity_definitions', {
  id: uuid('id').primaryKey(),
  worldId: uuid('world_id')
    .notNull()
    .references(() => worlds.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  icon: varchar('icon', { length: 50 }),
  propertyDefinitionIds: uuid('property_definition_ids').array().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type EntityDefinitionRow = typeof entityDefinitions.$inferSelect;
export type NewEntityDefinitionRow = typeof entityDefinitions.$inferInsert;
