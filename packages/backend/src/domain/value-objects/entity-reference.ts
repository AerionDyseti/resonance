import type { EntityId } from './ids';

/**
 * EntityReference - Value object representing an [[entity]] reference in body content
 * Extracted from markdown body and stored separately for dependency tracking
 * Missing references (target not found) use targetEntityId = null
 */
export interface EntityReference {
  /** The entity being referenced (null if not yet resolved or missing) */
  targetEntityId: EntityId | null;
  /** The display name used in the reference (e.g., "Frodo" from [[Frodo]]) */
  displayName: string;
  /** Character offset in the body where this reference starts */
  startOffset: number;
  /** Character offset in the body where this reference ends */
  endOffset: number;
}
