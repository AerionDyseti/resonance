import type { WorldId, EntityDefinitionId, PropertyDefinitionId, EntityId } from '../ids';
import type { PropertyValue } from './property';

/**
 * Entity - An instance of an EntityDefinition with specific property values
 * Examples: A specific character, location, faction, etc.
 */
export interface Entity {
  id: EntityId;
  worldId: WorldId;
  definitionId: EntityDefinitionId;
  name: string;
  // Markdown content body
  body: string;
  // Property values for this entity (keyed by property definition id)
  properties: Record<PropertyDefinitionId, PropertyValue>;
  // Vector embedding for semantic search
  embedding?: number[];
  createdAt: Date;
  updatedAt: Date;
}
