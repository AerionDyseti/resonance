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
  // Templates
  Template,
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
