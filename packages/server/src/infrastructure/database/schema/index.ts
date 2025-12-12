import { relations } from 'drizzle-orm';

import { worlds } from './worlds';
import { entityDefinitions } from './entity-definitions';
import { propertyDefinitions } from './property-definitions';
import { entityDefinitionPropertyDefinitions } from './entity-definition-property-definitions';
import { entities } from './entities';
import { relationships } from './relationships';

export {
  worlds,
  entityDefinitions,
  propertyDefinitions,
  entityDefinitionPropertyDefinitions,
  entities,
  relationships,
};

export const worldsRelations = relations(worlds, ({ many }) => ({
  entityDefinitions: many(entityDefinitions),
  propertyDefinitions: many(propertyDefinitions),
  entities: many(entities),
  relationships: many(relationships),
}));

export const entityDefinitionsRelations = relations(entityDefinitions, ({ one, many }) => ({
  world: one(worlds, {
    fields: [entityDefinitions.worldId],
    references: [worlds.id],
  }),
  entities: many(entities),
  entityDefinitionPropertyDefinitions: many(entityDefinitionPropertyDefinitions),
}));

export const propertyDefinitionsRelations = relations(propertyDefinitions, ({ one, many }) => ({
  world: one(worlds, {
    fields: [propertyDefinitions.worldId],
    references: [worlds.id],
  }),
  entityDefinitionPropertyDefinitions: many(entityDefinitionPropertyDefinitions),
}));

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

// Export inferred types for use throughout the server
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
