// Domain layer exports
// This is the core of the application - pure business logic with no external dependencies

// ==================== Value Objects (Branded IDs) ====================
export type {
  Brand,
  Unbrand,
  UserId,
  WorldId,
  TagId,
  TemplateId,
  EntityDefinitionId,
  PropertyDefinitionId,
  PropertyId,
  EntityId,
  RelationshipDefinitionId,
  RelationshipId,
  EmbeddingChunkId,
} from './value-objects/ids';

export {
  userId,
  worldId,
  tagId,
  templateId,
  entityDefinitionId,
  propertyDefinitionId,
  propertyId,
  entityId,
  relationshipDefinitionId,
  relationshipId,
  embeddingChunkId,
  createUserId,
  createWorldId,
  createTagId,
  createTemplateId,
  createEntityDefinitionId,
  createPropertyDefinitionId,
  createPropertyId,
  createEntityId,
  createRelationshipDefinitionId,
  createRelationshipId,
  createEmbeddingChunkId,
  isValidUuid,
} from './value-objects/ids';

// ==================== Value Objects (Content) ====================
export type { EntityReference } from './value-objects/entity-reference';
export type { PropertyUsage } from './value-objects/property-usage';
export type {
  EmbeddingChunk,
  EmbeddingChunkPersistenceRecord,
} from './value-objects/embedding-chunk';

// ==================== Domain Models (Interfaces) ====================
// These interfaces are the public data shapes for external layers
export type { IUser, UserPersistenceRecord } from './models/user';
export type { IWorld, WorldPersistenceRecord } from './models/world';
export type { ITag, TagPersistenceRecord } from './models/tag';
export type { ITemplate, TemplatePersistenceRecord } from './models/template';
export type {
  IEntityDefinition,
  EntityDefinitionPersistenceRecord,
} from './models/entity-definition';
export type {
  IPropertyDefinition,
  PropertyDefinitionPersistenceRecord,
  PropertyConstraints,
} from './models/property-definition';
export type { IProperty, PropertyPersistenceRecord, PropertyValue } from './models/property';
export type { IEntity, EntityPersistenceRecord } from './models/entity';
export type {
  IRelationshipDefinition,
  RelationshipDefinitionPersistenceRecord,
} from './models/relationship-definition';
export type { IRelationship, RelationshipPersistenceRecord } from './models/relationship';

// ==================== Domain Models (Classes) ====================
// Rich models with behavior - for use within domain layer
export { User } from './models/user';
export { World } from './models/world';
export { Tag } from './models/tag';
export { Template } from './models/template';
export { EntityDefinition } from './models/entity-definition';
export { PropertyDefinition, PropertyType } from './models/property-definition';
export { Property } from './models/property';
export { Entity } from './models/entity';
export { RelationshipDefinition } from './models/relationship-definition';
export { Relationship } from './models/relationship';

// ==================== Repository Interfaces (Ports) ====================
export type { IWorldRepository } from './repositories/world.repository';
