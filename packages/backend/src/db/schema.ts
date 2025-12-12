import { sqliteTable, text, integer, blob, index } from 'drizzle-orm/sqlite-core';

/**
 * Worlds table - represents top-level namespaces for entities
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

/**
 * Entities table - represents objects within a world
 * Maps to the Entity domain type
 */
export const entities = sqliteTable(
  'entities',
  {
    id: text('id').primaryKey(),
    worldId: text('world_id').notNull(),
    templateId: text('template_id'),
    name: text('name').notNull(),
    description: text('description'),
    type: text('type').notNull(), // EntityType
    metadata: blob('metadata', { mode: 'json' }), // JSON serialized metadata
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    worldIdIdx: index('entities_world_id_idx').on(table.worldId),
    templateIdIdx: index('entities_template_id_idx').on(table.templateId),
    typeIdx: index('entities_type_idx').on(table.type),
  })
);

/**
 * Properties table - represents properties of entities
 * Maps to the Property domain type
 */
export const properties = sqliteTable(
  'properties',
  {
    id: text('id').primaryKey(),
    entityId: text('entity_id').notNull(),
    name: text('name').notNull(),
    value: text('value').notNull(), // JSON serialized value
    type: text('type').notNull(), // PropertyType
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    entityIdIdx: index('properties_entity_id_idx').on(table.entityId),
  })
);

/**
 * Relationships table - represents connections between entities
 * Maps to the Relationship domain type
 */
export const relationships = sqliteTable(
  'relationships',
  {
    id: text('id').primaryKey(),
    sourceId: text('source_id').notNull(),
    targetId: text('target_id').notNull(),
    type: text('type').notNull(), // RelationshipType
    label: text('label'),
    metadata: blob('metadata', { mode: 'json' }), // JSON serialized metadata
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    sourceIdIdx: index('relationships_source_id_idx').on(table.sourceId),
    targetIdIdx: index('relationships_target_id_idx').on(table.targetId),
    typeIdx: index('relationships_type_idx').on(table.type),
  })
);

/**
 * Templates table - represents reusable entity templates
 * Maps to the Template domain type
 */
export const templates = sqliteTable(
  'templates',
  {
    id: text('id').primaryKey(),
    worldId: text('world_id').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    schema: blob('schema', { mode: 'json' }).notNull(), // JSON schema defining template structure
    createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull(),
  },
  (table) => ({
    worldIdIdx: index('templates_world_id_idx').on(table.worldId),
    nameIdx: index('templates_name_idx').on(table.name),
  })
);
