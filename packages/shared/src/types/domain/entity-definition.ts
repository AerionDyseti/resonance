import type { WorldId, EntityDefinitionId, PropertyDefinitionId } from '../ids';

/**
 * EntityDefinition - A schema that defines what properties an entity can have
 * Similar to a database table schema or Notion database type
 */
export interface EntityDefinition {
  id: EntityDefinitionId;
  worldId: WorldId;
  name: string;
  description?: string;
  icon?: string;
  // Property definitions used by this entity definition (via junction table)
  propertyDefinitionIds: PropertyDefinitionId[];
  createdAt: Date;
  updatedAt: Date;
}
