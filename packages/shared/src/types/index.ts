// Core domain types for Resonance
// Shared types for frontend, backend, and API communication

// Domain types
export type {
  // Worlds
  World,
  // Entity Types
  EntityType,
  // Entities
  Entity,
  // Properties
  Property,
  PropertyValue,
  PropertyConstraints,
  PropertyType,
  // Templates
  Template,
  // Relationships
  Relationship,
} from './domain.js';

export {
  // Property type enum
  PropertyType,
} from './domain.js';

export type {
  // API Response types
  ApiResponse,
  ApiError,
  PaginatedResponse,
} from './api.js';

// Zod validation schemas for tRPC
export * from './schemas.js';
