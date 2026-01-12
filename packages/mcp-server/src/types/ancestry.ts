/**
 * Ancestry Entity Type
 *
 * Represents biological heritage (race/species).
 * Purely physical/biological — social aspects are in Culture.
 */

import type { Entity } from './entity.js';
import type { AncestryId, LocationId, CultureId, LoreId } from './ids.js';

/** Ancestry-specific properties */
export interface AncestryProperties {
  // Description (for embedding)
  description?: string;

  // Physical characteristics
  physicalCharacteristics?: string[];
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'huge';
  lifespan?: string;

  // Biological traits
  typicalTraits?: string[]; // Innate characteristics (keen senses, darkvision, etc.)

  // Distribution
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
  homelandIds?: LocationId[];

  // Associated cultures
  typicalCultureIds?: CultureId[];

  // Reference lore for deeper context
  loreIds?: LoreId[];

  // Escape hatch
  extra?: Record<string, string>;
}

/** Ancestry entity with typed properties */
export interface Ancestry extends Entity<AncestryId, AncestryProperties> {
  type: 'ancestry';
}
