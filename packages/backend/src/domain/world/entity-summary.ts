import type { EntityId, EntityDefinitionId } from '../shared/ids';

/**
 * EntitySummary - Lightweight projection of Entity
 *
 * Used by Intelligence and API layers for efficient context management.
 * Contains only the essential fields needed for LLM queries and UI display.
 */
export interface EntitySummary {
  readonly id: EntityId;
  readonly name: string;
  readonly definitionId: EntityDefinitionId;
  readonly summary: string | null;
}
