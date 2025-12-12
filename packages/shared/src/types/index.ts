// Core domain types for Resonance
// Shared types for frontend, backend, and API communication

// Branded ID types for type-safe identifiers
export type {
  Brand,
  Unbrand,
  WorldId,
  EntityDefinitionId,
  PropertyDefinitionId,
  EntityId,
  RelationshipId,
} from './ids';

// ID factory functions
export {
  worldId,
  entityDefinitionId,
  propertyDefinitionId,
  entityId,
  relationshipId,
  createWorldId,
  createEntityDefinitionId,
  createPropertyDefinitionId,
  createEntityId,
  createRelationshipId,
  isValidUuid,
} from './ids';

// Domain types
export type {
  // Worlds
  World,
  // Entity Types
  EntityDefinition as EntityDefinition,
  // Entities
  Entity,
  // Property Definitions
  PropertyDefinition,
  PropertyValue,
  PropertyConstraints,
  // Relationships
  Relationship,
} from './domain';

// Property type enum (exports both type and value)
export { PropertyType } from './domain';

export type {
  // API Response types
  ApiResponse,
  ApiError,
  PaginatedResponse,
} from './api';
