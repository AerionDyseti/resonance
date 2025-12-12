import { pgTable, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';

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
