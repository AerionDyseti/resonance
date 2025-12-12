import { sqliteTable, text, integer, index, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ==================== WORLDS ====================

/**
 * Worlds table - top-level container for all entities
 * Maps to the World domain type
 */
export const worlds = sqliteTable(
  'worlds',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    nameIdx: index('worlds_name_idx').on(table.name),
  })
);

export const worldsRelations = relations(worlds, ({ many }) => ({
  entityTypes: many(entityTypes),
  propertyDefinitions: many(propertyDefinitions),
  entities: many(entities),
  relationships: many(relationships),
}));

// ==================== ENTITY TYPES ====================

/**
 * Entity types table - schema definitions for entities
 * Maps to the EntityType domain type
 */
export const entityTypes = sqliteTable(
  'entity_types',
  {
    id: text('id').primaryKey(),
    worldId: text('world_id').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    icon: text('icon'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    worldIdIdx: index('entity_types_world_id_idx').on(table.worldId),
    nameIdx: index('entity_types_name_idx').on(table.name),
  })
);

export const entityTypesRelations = relations(entityTypes, ({ one, many }) => ({
  world: one(worlds, {
    fields: [entityTypes.worldId],
    references: [worlds.id],
  }),
  entities: many(entities),
  entityTypePropertyDefinitions: many(entityTypePropertyDefinitions),
}));

// ==================== PROPERTY DEFINITIONS ====================

/**
 * Property definitions table - reusable field definitions
 * Maps to the PropertyDefinition domain type
 *
 * Property definitions are world-scoped and can be shared
 * across multiple entity types via the junction table.
 */
export const propertyDefinitions = sqliteTable(
  'property_definitions',
  {
    id: text('id').primaryKey(),
    worldId: text('world_id').notNull(),
    name: text('name').notNull(),
    type: text('type').notNull(), // PropertyType enum value
    description: text('description'),
    required: integer('required', { mode: 'boolean' }).notNull().default(false),
    defaultValue: text('default_value'), // JSON string for PropertyValue
    constraints: text('constraints'), // JSON string for PropertyConstraints
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
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
  entityTypePropertyDefinitions: many(entityTypePropertyDefinitions),
}));

// ==================== ENTITY TYPE <-> PROPERTY DEFINITION JUNCTION ====================

/**
 * Junction table for EntityType <-> PropertyDefinition (many-to-many)
 * Tracks which property definitions are used by which entity types
 */
export const entityTypePropertyDefinitions = sqliteTable(
  'entity_type_property_definitions',
  {
    entityTypeId: text('entity_type_id').notNull(),
    propertyDefinitionId: text('property_definition_id').notNull(),
    position: integer('position').notNull().default(0), // For ordering
  },
  (table) => ({
    pk: primaryKey({ columns: [table.entityTypeId, table.propertyDefinitionId] }),
    entityTypeIdIdx: index('etpd_entity_type_id_idx').on(table.entityTypeId),
    propertyDefinitionIdIdx: index('etpd_property_definition_id_idx').on(
      table.propertyDefinitionId
    ),
  })
);

export const entityTypePropertyDefinitionsRelations = relations(
  entityTypePropertyDefinitions,
  ({ one }) => ({
    entityType: one(entityTypes, {
      fields: [entityTypePropertyDefinitions.entityTypeId],
      references: [entityTypes.id],
    }),
    propertyDefinition: one(propertyDefinitions, {
      fields: [entityTypePropertyDefinitions.propertyDefinitionId],
      references: [propertyDefinitions.id],
    }),
  })
);

// ==================== ENTITIES ====================

/**
 * Entities table - instances of entity types with property values
 * Maps to the Entity domain type
 */
export const entities = sqliteTable(
  'entities',
  {
    id: text('id').primaryKey(),
    worldId: text('world_id').notNull(),
    typeId: text('type_id').notNull(),
    name: text('name').notNull(),
    body: text('body').notNull().default(''), // Markdown content
    properties: text('properties').notNull().default('{}'), // JSON Record<string, PropertyValue>
    // embedding column deferred to issue #29
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    worldIdIdx: index('entities_world_id_idx').on(table.worldId),
    typeIdIdx: index('entities_type_id_idx').on(table.typeId),
    nameIdx: index('entities_name_idx').on(table.name),
  })
);

export const entitiesRelations = relations(entities, ({ one, many }) => ({
  world: one(worlds, {
    fields: [entities.worldId],
    references: [worlds.id],
  }),
  entityType: one(entityTypes, {
    fields: [entities.typeId],
    references: [entityTypes.id],
  }),
  relationshipsFrom: many(relationships, { relationName: 'fromEntity' }),
  relationshipsTo: many(relationships, { relationName: 'toEntity' }),
}));

// ==================== RELATIONSHIPS ====================

/**
 * Relationships table - typed connections between entities
 * Maps to the Relationship domain type
 */
export const relationships = sqliteTable(
  'relationships',
  {
    id: text('id').primaryKey(),
    worldId: text('world_id').notNull(),
    fromEntityId: text('from_entity_id').notNull(),
    toEntityId: text('to_entity_id').notNull(),
    type: text('type').notNull(), // e.g., "parent", "ally", "enemy"
    description: text('description'),
    metadata: text('metadata'), // JSON Record<string, unknown>
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
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

export type EntityTypeRecord = typeof entityTypes.$inferSelect;
export type NewEntityTypeRecord = typeof entityTypes.$inferInsert;

export type PropertyDefinitionRecord = typeof propertyDefinitions.$inferSelect;
export type NewPropertyDefinitionRecord = typeof propertyDefinitions.$inferInsert;

export type EntityTypePropertyDefinitionRecord = typeof entityTypePropertyDefinitions.$inferSelect;
export type NewEntityTypePropertyDefinitionRecord =
  typeof entityTypePropertyDefinitions.$inferInsert;

export type EntityRecord = typeof entities.$inferSelect;
export type NewEntityRecord = typeof entities.$inferInsert;

export type RelationshipRecord = typeof relationships.$inferSelect;
export type NewRelationshipRecord = typeof relationships.$inferInsert;
