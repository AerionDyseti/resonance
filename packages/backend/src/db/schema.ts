import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  index,
  primaryKey,
  vector,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==================== WORLDS ====================

/**
 * Worlds table - top-level container for all entities
 * Maps to the World domain type
 */
export const worlds = pgTable(
  'worlds',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    nameIdx: index('worlds_name_idx').on(table.name),
  })
);

export const worldsRelations = relations(worlds, ({ many }) => ({
  entityDefinitions: many(entityDefinitions),
  propertyDefinitions: many(propertyDefinitions),
  entities: many(entities),
  relationships: many(relationships),
}));

// ==================== ENTITY DEFINITIONS ====================

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

export const entityDefinitionsRelations = relations(entityDefinitions, ({ one, many }) => ({
  world: one(worlds, {
    fields: [entityDefinitions.worldId],
    references: [worlds.id],
  }),
  entities: many(entities),
  entityDefinitionPropertyDefinitions: many(entityDefinitionPropertyDefinitions),
}));

// ==================== PROPERTY DEFINITIONS ====================

/**
 * Property definitions table - reusable field definitions
 * Maps to the PropertyDefinition domain type
 *
 * Property definitions are world-scoped and can be shared
 * across multiple entity types via the junction table.
 */
export const propertyDefinitions = pgTable(
  'property_definitions',
  {
    id: text('id').primaryKey(),
    worldId: text('world_id').notNull(),
    name: text('name').notNull(),
    type: text('type').notNull(), // PropertyType enum value
    description: text('description'),
    required: boolean('required').notNull().default(false),
    defaultValue: text('default_value'), // JSON string for PropertyValue
    constraints: text('constraints'), // JSON string for PropertyConstraints
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    worldIdIdx: index('property_definitions_world_id_idx').on(table.worldId),
    nameIdx: index('property_definitions_name_idx').on(table.name),
    typeIdx: index('property_definitions_type_idx').on(table.type),
  })
);

export const propertyDefinitionsRelations = relations(propertyDefinitions, ({ one, many }) => ({
  world: one(worlds, {
    fields: [propertyDefinitions.worldId],
    references: [worlds.id],
  }),
  entityDefinitionPropertyDefinitions: many(entityDefinitionPropertyDefinitions),
}));

// ==================== ENTITY DEFINITION <-> PROPERTY DEFINITION JUNCTION ====================

/**
 * Junction table for EntityDefinition <-> PropertyDefinition (many-to-many)
 * Tracks which property definitions are used by which entity definitions
 */
export const entityDefinitionPropertyDefinitions = pgTable(
  'entity_definition_property_definitions',
  {
    entityDefinitionId: text('entity_definition_id').notNull(),
    propertyDefinitionId: text('property_definition_id').notNull(),
    position: integer('position').notNull().default(0), // For ordering
  },
  (table) => ({
    pk: primaryKey({ columns: [table.entityDefinitionId, table.propertyDefinitionId] }),
    entityDefinitionIdIdx: index('edpd_entity_definition_id_idx').on(table.entityDefinitionId),
    propertyDefinitionIdIdx: index('edpd_property_definition_id_idx').on(
      table.propertyDefinitionId
    ),
  })
);

export const entityDefinitionPropertyDefinitionsRelations = relations(
  entityDefinitionPropertyDefinitions,
  ({ one }) => ({
    entityDefinition: one(entityDefinitions, {
      fields: [entityDefinitionPropertyDefinitions.entityDefinitionId],
      references: [entityDefinitions.id],
    }),
    propertyDefinition: one(propertyDefinitions, {
      fields: [entityDefinitionPropertyDefinitions.propertyDefinitionId],
      references: [propertyDefinitions.id],
    }),
  })
);

// ==================== ENTITIES ====================

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
    embedding: vector('embedding', { dimensions: 1536 }), // Vector embedding for semantic search (1536 = OpenAI ada-002/text-embedding-3-small dimension)
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    worldIdIdx: index('entities_world_id_idx').on(table.worldId),
    definitionIdIdx: index('entities_definition_id_idx').on(table.definitionId),
    nameIdx: index('entities_name_idx').on(table.name),
  })
);

export const entitiesRelations = relations(entities, ({ one, many }) => ({
  world: one(worlds, {
    fields: [entities.worldId],
    references: [worlds.id],
  }),
  entityDefinition: one(entityDefinitions, {
    fields: [entities.definitionId],
    references: [entityDefinitions.id],
  }),
  relationshipsFrom: many(relationships, { relationName: 'fromEntity' }),
  relationshipsTo: many(relationships, { relationName: 'toEntity' }),
}));

// ==================== RELATIONSHIPS ====================

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

export const relationshipsRelations = relations(relationships, ({ one }) => ({
  world: one(worlds, {
    fields: [relationships.worldId],
    references: [worlds.id],
  }),
  fromEntity: one(entities, {
    fields: [relationships.fromEntityId],
    references: [entities.id],
    relationName: 'fromEntity',
  }),
  toEntity: one(entities, {
    fields: [relationships.toEntityId],
    references: [entities.id],
    relationName: 'toEntity',
  }),
}));

// ==================== TYPE EXPORTS ====================

// Export inferred types for use throughout the backend
export type WorldRecord = typeof worlds.$inferSelect;
export type NewWorldRecord = typeof worlds.$inferInsert;

export type EntityDefinitionRecord = typeof entityDefinitions.$inferSelect;
export type NewEntityDefinitionRecord = typeof entityDefinitions.$inferInsert;

export type PropertyDefinitionRecord = typeof propertyDefinitions.$inferSelect;
export type NewPropertyDefinitionRecord = typeof propertyDefinitions.$inferInsert;

export type EntityDefinitionPropertyDefinitionRecord =
  typeof entityDefinitionPropertyDefinitions.$inferSelect;
export type NewEntityDefinitionPropertyDefinitionRecord =
  typeof entityDefinitionPropertyDefinitions.$inferInsert;

export type EntityRecord = typeof entities.$inferSelect;
export type NewEntityRecord = typeof entities.$inferInsert;

export type RelationshipRecord = typeof relationships.$inferSelect;
export type NewRelationshipRecord = typeof relationships.$inferInsert;
