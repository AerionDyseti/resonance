// Core domain types for Resonance world building system
// These types represent the fundamental entities in the Resonance data model

import type {
  WorldId,
  EntityTypeId,
  PropertyDefinitionId,
  EntityId,
  RelationshipId,
} from './ids.js';

/**
 * World - A container for all entities, schemas, and relationships
 * Each user can have multiple worlds
 */
export interface World {
  id: WorldId;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * EntityType - A schema that defines what properties an entity can have
 * Similar to a database table schema or Notion database type
 */
export interface EntityType {
  id: EntityTypeId;
  worldId: WorldId;
  name: string;
  description?: string;
  icon?: string;
  // Property definitions used by this entity type (via junction table)
  propertyDefinitionIds: PropertyDefinitionId[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Entity - An instance of an EntityType with specific property values
 * Examples: A specific character, location, faction, etc.
 */
export interface Entity {
  id: EntityId;
  worldId: WorldId;
  typeId: EntityTypeId;
  name: string;
  // Markdown content body
  body: string;
  // Property values for this entity (keyed by property definition id)
  properties: Record<PropertyDefinitionId, PropertyValue>;
  // Vector embedding for semantic search (deferred to issue #29)
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * PropertyDefinition - A reusable field definition that can be used across entity types
 * Examples: age (number), alignment (select), backstory (text)
 *
 * Property definitions are world-scoped and can be shared across multiple entity types
 * via the entity_type_property_definitions junction table.
 */
export interface PropertyDefinition {
  id: PropertyDefinitionId;
  worldId: WorldId;
  name: string;
  type: PropertyType;
  description?: string;
  required: boolean;
  defaultValue?: PropertyValue;
  // Type-specific constraints
  constraints?: PropertyConstraints;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * PropertyValue - The actual value stored for a property on an entity
 */
export type PropertyValue = string | number | boolean | string[] | null;

/**
 * Supported property types
 */
export enum PropertyType {
  Text = 'text',
  LongText = 'long_text',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  Select = 'select',
  MultiSelect = 'multi_select',
  Reference = 'reference', // Reference to another entity
  CreatedTime = 'created_time',
  UpdatedTime = 'updated_time',
}

/**
 * PropertyConstraints - Type-specific validation rules
 */
export interface PropertyConstraints {
  minValue?: number;
  maxValue?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string; // Regex pattern for validation
  options?: string[]; // For select/multi-select
  referencedEntityTypeId?: EntityTypeId; // For reference properties - which entity type can be referenced
}

/**
 * Relationship - A typed connection between two entities
 * Supports different relationship types (parent-child, has-many, etc.)
 */
export interface Relationship {
  id: RelationshipId;
  worldId: WorldId;
  fromEntityId: EntityId;
  toEntityId: EntityId;
  type: string; // e.g., "parent", "child", "ally", "enemy"
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
