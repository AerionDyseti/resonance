import type { WorldId, EntityDefinitionId, PropertyDefinitionId } from '../ids';

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
  referencedEntityDefinitionId?: EntityDefinitionId; // For reference properties
}

/**
 * PropertyDefinition - A reusable field definition that can be used across entity types
 * Examples: age (number), alignment (select), backstory (text)
 *
 * Property definitions are world-scoped and can be shared across multiple entity types
 * via the entity_definition_property_definitions junction table.
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
