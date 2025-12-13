import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { worlds } from './worlds';
import { entityDefinitions } from './entity-definitions';

/**
 * Relationship definitions table - schema for relationship types
 * Defines what kinds of connections can exist between entities
 */
export const relationshipDefinitions = pgTable('relationship_definitions', {
  id: uuid('id').primaryKey(),
  worldId: uuid('world_id')
    .notNull()
    .references(() => worlds.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  // Optional inverse name for display (e.g., "parent_of" / "child_of")
  inverseName: varchar('inverse_name', { length: 255 }),
  // Whether the relationship is symmetric (A-B implies B-A)
  isSymmetric: boolean('is_symmetric').notNull().default(false),
  // Optional constraints on which entity types can be connected
  sourceEntityDefinitionId: uuid('source_entity_definition_id').references(
    () => entityDefinitions.id
  ),
  targetEntityDefinitionId: uuid('target_entity_definition_id').references(
    () => entityDefinitions.id
  ),
  // Properties that can be attached to relationships of this type
  propertyDefinitionIds: uuid('property_definition_ids').array().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type RelationshipDefinitionRow = typeof relationshipDefinitions.$inferSelect;
export type NewRelationshipDefinitionRow = typeof relationshipDefinitions.$inferInsert;
