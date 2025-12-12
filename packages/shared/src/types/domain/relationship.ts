import type { WorldId, EntityId, RelationshipId } from '../ids';

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
