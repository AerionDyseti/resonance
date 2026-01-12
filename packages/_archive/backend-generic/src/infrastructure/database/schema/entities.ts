import { pgTable, uuid, varchar, text, timestamp, jsonb, uniqueIndex } from 'drizzle-orm/pg-core';
import { worlds } from './worlds';
import { entityDefinitions } from './entity-definitions';

/**
 * Property instance stored as JSONB
 * Represents a single property value on an entity
 */
export interface PropertyJson {
  id: string;
  definitionId: string;
  value: string | number | boolean | string[] | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

/**
 * Entities table - content instances
 * The actual characters, locations, items, etc. in a world
 */
export const entities = pgTable(
  'entities',
  {
    id: uuid('id').primaryKey(),
    worldId: uuid('world_id')
      .notNull()
      .references(() => worlds.id, { onDelete: 'cascade' }),
    definitionId: uuid('definition_id')
      .notNull()
      .references(() => entityDefinitions.id),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    aliases: text('aliases').array().default([]),
    summary: text('summary'),
    body: text('body').notNull().default(''),
    imageUrl: text('image_url'),
    // Properties stored as JSONB array
    properties: jsonb('properties').$type<PropertyJson[]>().notNull().default([]),
    // Tag IDs stored as UUID array
    tagIds: uuid('tag_ids').array().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Slug must be unique within a world
    uniqueIndex('entities_world_slug_idx').on(table.worldId, table.slug),
  ]
);

export type EntityRow = typeof entities.$inferSelect;
export type NewEntityRow = typeof entities.$inferInsert;
