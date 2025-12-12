import { pgTable, text, integer, index, primaryKey } from 'drizzle-orm/pg-core';

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
    pk: primaryKey({
      columns: [table.entityDefinitionId, table.propertyDefinitionId],
    }),
    entityDefinitionIdIdx: index('edpd_entity_definition_id_idx').on(table.entityDefinitionId),
    propertyDefinitionIdIdx: index('edpd_property_definition_id_idx').on(
      table.propertyDefinitionId
    ),
  })
);
