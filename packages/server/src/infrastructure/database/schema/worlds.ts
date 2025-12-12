import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';

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
