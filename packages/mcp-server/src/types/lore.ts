/**
 * Lore Entity Type
 *
 * Represents background truths about the world.
 */

import type { Entity } from './entity.js';
import type { LoreId, CharacterId, EntityId } from './ids.js';

/** Lore categories */
export type LoreCategory =
  | 'magic'
  | 'history'
  | 'geography'
  | 'religion'
  | 'culture'
  | 'politics'
  | 'nature'
  | 'other';

/** Lore-specific properties */
export interface LoreProperties {
  // Description (for embedding)
  description: string; // The actual lore content

  // Classification
  category: LoreCategory;

  // Significance
  significance?: string; // Why it matters

  // Origin & History
  origin?: string; // Where this knowledge came from
  history?: string[]; // How understanding of this has evolved

  // Visibility
  isSecret?: boolean; // Known only to GM
  // Who knows this lore:
  //   undefined = common knowledge (everyone knows)
  //   [] = lost/secret knowledge (no one knows)
  //   [ids...] = known by specific characters
  knownByIds?: CharacterId[];

  // Related entities this lore pertains to
  relatedEntityIds?: EntityId[];

  // Escape hatch
  extra?: Record<string, string>;
}

/** Lore entity with typed properties */
export interface Lore extends Entity<LoreId, LoreProperties> {
  type: 'lore';
}
