// Core domain types for Resonance world building system
// These types represent the fundamental entities in the Resonance data model

/**
 * World - A container for all entities, schemas, and relationships
 * Each user can have multiple worlds
 */
export interface World {
  id: string;
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
  id: string;
  worldId: string;
  name: string;
  description?: string;
  icon?: string;
  // Templates/mixins that this entity type includes
  templateIds: string[];
  // Direct properties defined on this type
  propertyIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Entity - An instance of an EntityType with specific property values
 * Examples: A specific character, location, faction, etc.
 */
export interface Entity {
  id: string;
  worldId: string;
  typeId: string;
  name: string;
  // Markdown content body
  body: string;
  // Property values for this entity
  properties: Record<string, PropertyValue>;
  // Vector embedding for semantic search
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Property - A field on an entity type that stores a specific type of data
 * Examples: age (number), alignment (select), backstory (text)
 */
export interface Property {
  id: string;
  typeId: string;
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
  relationshipType?: string; // For reference properties
}

/**
 * Template (Mixin) - Reusable group of properties that can be included in entity types
 * Allows property composition/inheritance
 */
export interface Template {
  id: string;
  worldId: string;
  name: string;
  description?: string;
  propertyIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Relationship - A typed connection between two entities
 * Supports different relationship types (parent-child, has-many, etc.)
 */
export interface Relationship {
  id: string;
  worldId: string;
  fromEntityId: string;
  toEntityId: string;
  type: string; // e.g., "parent", "child", "ally", "enemy"
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
