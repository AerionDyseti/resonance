import { relations } from 'drizzle-orm';
import { users } from './users';
import { worlds } from './worlds';
import { entityDefinitions } from './entity-definitions';
import { propertyDefinitions } from './property-definitions';
import { entities } from './entities';
import { relationships } from './relationships';
import { relationshipDefinitions } from './relationship-definitions';
import { tags } from './tags';

/**
 * Drizzle relations definitions
 * These enable type-safe joins and nested queries
 */

export const usersRelations = relations(users, ({ many }) => ({
  worlds: many(worlds),
}));

export const worldsRelations = relations(worlds, ({ one, many }) => ({
  owner: one(users, {
    fields: [worlds.ownerId],
    references: [users.id],
  }),
  entityDefinitions: many(entityDefinitions),
  propertyDefinitions: many(propertyDefinitions),
  entities: many(entities),
  relationships: many(relationships),
  relationshipDefinitions: many(relationshipDefinitions),
  tags: many(tags),
}));

export const entityDefinitionsRelations = relations(entityDefinitions, ({ one, many }) => ({
  world: one(worlds, {
    fields: [entityDefinitions.worldId],
    references: [worlds.id],
  }),
  entities: many(entities),
}));

export const propertyDefinitionsRelations = relations(propertyDefinitions, ({ one }) => ({
  world: one(worlds, {
    fields: [propertyDefinitions.worldId],
    references: [worlds.id],
  }),
}));

export const entitiesRelations = relations(entities, ({ one, many }) => ({
  world: one(worlds, {
    fields: [entities.worldId],
    references: [worlds.id],
  }),
  definition: one(entityDefinitions, {
    fields: [entities.definitionId],
    references: [entityDefinitions.id],
  }),
  outgoingRelationships: many(relationships, { relationName: 'sourceEntity' }),
  incomingRelationships: many(relationships, { relationName: 'targetEntity' }),
}));

export const relationshipDefinitionsRelations = relations(relationshipDefinitions, ({ one }) => ({
  world: one(worlds, {
    fields: [relationshipDefinitions.worldId],
    references: [worlds.id],
  }),
  sourceEntityDefinition: one(entityDefinitions, {
    fields: [relationshipDefinitions.sourceEntityDefinitionId],
    references: [entityDefinitions.id],
  }),
  targetEntityDefinition: one(entityDefinitions, {
    fields: [relationshipDefinitions.targetEntityDefinitionId],
    references: [entityDefinitions.id],
  }),
}));

export const relationshipsRelations = relations(relationships, ({ one }) => ({
  world: one(worlds, {
    fields: [relationships.worldId],
    references: [worlds.id],
  }),
  definition: one(relationshipDefinitions, {
    fields: [relationships.definitionId],
    references: [relationshipDefinitions.id],
  }),
  sourceEntity: one(entities, {
    fields: [relationships.sourceEntityId],
    references: [entities.id],
    relationName: 'sourceEntity',
  }),
  targetEntity: one(entities, {
    fields: [relationships.targetEntityId],
    references: [entities.id],
    relationName: 'targetEntity',
  }),
}));

export const tagsRelations = relations(tags, ({ one }) => ({
  world: one(worlds, {
    fields: [tags.worldId],
    references: [worlds.id],
  }),
}));
