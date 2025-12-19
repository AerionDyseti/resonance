// Table definitions
export { users, type UserRow, type NewUserRow } from './users';
export { worlds, type WorldRow, type NewWorldRow } from './worlds';
export {
  entityDefinitions,
  type EntityDefinitionRow,
  type NewEntityDefinitionRow,
} from './entity-definitions';
export {
  propertyDefinitions,
  PROPERTY_TYPES,
  type PropertyType,
  type PropertyConstraints,
  type PropertyDefinitionRow,
  type NewPropertyDefinitionRow,
} from './property-definitions';
export { tags, type TagRow, type NewTagRow } from './tags';
export { entities, type PropertyJson, type EntityRow, type NewEntityRow } from './entities';
export {
  relationshipDefinitions,
  type RelationshipDefinitionRow,
  type NewRelationshipDefinitionRow,
} from './relationship-definitions';
export { relationships, type RelationshipRow, type NewRelationshipRow } from './relationships';

// Relations
export {
  usersRelations,
  worldsRelations,
  entityDefinitionsRelations,
  propertyDefinitionsRelations,
  entitiesRelations,
  relationshipDefinitionsRelations,
  relationshipsRelations,
  tagsRelations,
} from './relations';
