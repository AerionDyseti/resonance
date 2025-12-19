import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

/**
 * Worlds table - top-level container for worldbuilding projects
 * Each world belongs to a single owner (user)
 */
export const worlds = pgTable('worlds', {
  id: uuid('id').primaryKey(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type WorldRow = typeof worlds.$inferSelect;
export type NewWorldRow = typeof worlds.$inferInsert;
