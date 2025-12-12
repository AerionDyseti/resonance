// Core domain types for Resonance
// Shared types for frontend, backend, and API communication

// Branded ID types for type-safe identifiers
export type {
  Brand,
  Unbrand,
  WorldId,
  EntityTypeId,
  PropertyDefinitionId,
  EntityId,
  RelationshipId,
} from './ids.js';

// ID factory functions
export {
  worldId,
  entityTypeId,
  propertyDefinitionId,
  entityId,
  relationshipId,
  isValidUuid,
} from './ids.js';

// Domain types
export type {
  // Worlds
  World,
  // Entity Types
  EntityType,
  // Entities
  Entity,
  // Property Definitions
  PropertyDefinition,
  PropertyValue,
  PropertyConstraints,
  // Relationships
  Relationship,
} from './domain.js';

// Property type enum (exports both type and value)
export { PropertyType } from './domain.js';

export type {
  // API Response types
  ApiResponse,
  ApiError,
  PaginatedResponse,
} from './api.js';

// Zod validation schemas for tRPC
export * from './schemas.js';
