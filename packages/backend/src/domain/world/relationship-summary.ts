import type { EntityId, RelationshipId } from '../shared/ids';

/**
 * RelationshipSummary - Lightweight projection of Relationship
 *
 * Used by Intelligence domain for graph traversal and path finding.
 * Contains only the essential fields needed for relationship queries.
 */
export interface RelationshipSummary {
  readonly id: RelationshipId;
  readonly sourceEntityId: EntityId;
  readonly targetEntityId: EntityId;
  readonly definitionName: string;
  readonly description: string | null;
}
