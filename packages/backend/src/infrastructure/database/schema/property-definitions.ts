import { pgTable, uuid, varchar, text, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { worlds } from './worlds';

/**
 * Property type enum values matching domain PropertyType
 */
export const PROPERTY_TYPES = [
  'text',
  'number',
  'boolean',
  'date',
  'rich-text',
  'reference',
  'enum',
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

/**
 * Property constraints stored as JSONB
 * Structure depends on property type
 */
export interface PropertyConstraints {
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: string;
  options?: string[]; // for enum type
  referencedEntityDefinitionId?: string; // for reference type
}

/**
 * Property definitions table - reusable field schemas
 * Defines what properties can be attached to entity definitions
 */
export const propertyDefinitions = pgTable('property_definitions', {
  id: uuid('id').primaryKey(),
  worldId: uuid('world_id')
    .notNull()
    .references(() => worlds.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull().$type<PropertyType>(),
  description: text('description'),
  required: boolean('required').notNull().default(false),
  defaultValue: jsonb('default_value'),
  constraints: jsonb('constraints').$type<PropertyConstraints>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type PropertyDefinitionRow = typeof propertyDefinitions.$inferSelect;
export type NewPropertyDefinitionRow = typeof propertyDefinitions.$inferInsert;
