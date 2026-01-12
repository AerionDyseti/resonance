/**
 * Misc Entity Type
 *
 * The escape hatch of escape hatches.
 * For anything the LLM needs to record that doesn't fit existing entity types.
 * If patterns emerge, promote to a proper entity type.
 */

import type { Entity } from './entity.js';
import type { MiscId } from './ids.js';

/** Misc-specific properties */
export interface MiscProperties {
  // Description (for embedding)
  description: string;

  // Escape hatch
  extra?: Record<string, string>;
}

/** Misc entity with typed properties */
export interface Misc extends Entity<MiscId, MiscProperties> {
  type: 'misc';
}
