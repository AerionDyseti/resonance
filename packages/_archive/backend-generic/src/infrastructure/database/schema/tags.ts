import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { worlds } from './worlds';

/**
 * Tags table - taxonomy labels for organizing entities
 */
export const tags = pgTable('tags', {
  id: uuid('id').primaryKey(),
  worldId: uuid('world_id')
    .notNull()
    .references(() => worlds.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  color: varchar('color', { length: 7 }), // hex color e.g. #FF5733
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type TagRow = typeof tags.$inferSelect;
export type NewTagRow = typeof tags.$inferInsert;
