/**
 * Base Entity Types for AIRP
 *
 * All entities share a common structure with type-specific properties
 * stored in a flexible JSON field.
 */

import type { EntityId, ChronicleId } from './ids.js';

/** All supported entity types */
export type EntityType =
  | 'character'
  | 'location'
  | 'organization'
  | 'event'
  | 'story'
  | 'item'
  | 'lore'
  | 'session'
  | 'ancestry'
  | 'culture'
  | 'scene'
  | 'misc'
  | 'chronicle';

/** Base entity structure shared by all types */
export interface Entity<TId extends EntityId = EntityId, TProperties = Record<string, unknown>> {
  id: TId;
  chronicleId: ChronicleId; // All entities belong to a chronicle
  type: EntityType;
  subtype?: string;
  name: string;
  summary?: string;
  body?: string;
  properties: TProperties;
  createdAt: string;
  updatedAt: string;
}

/** Lightweight entity reference for search results */
export interface EntitySummary<TId extends EntityId = EntityId> {
  id: TId;
  chronicleId: ChronicleId;
  type: EntityType;
  subtype?: string;
  name: string;
  summary?: string;
}

/** Update an entity's timestamp */
export function touchEntity<T extends Entity>(entity: T): T {
  return {
    ...entity,
    updatedAt: new Date().toISOString(),
  };
}
