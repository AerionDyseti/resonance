/**
 * Culture Entity Type
 *
 * Represents society and upbringing.
 * Social aspects including naming, customs, values — not biology.
 */

import type { Entity } from './entity.js';
import type { CultureId, LocationId, AncestryId, LoreId } from './ids.js';

/** Culture-specific properties */
export interface CultureProperties {
  // Description (for embedding)
  description?: string;

  // Values & Beliefs
  values?: string[];
  taboos?: string[]; // What's forbidden

  // Customs & Practices
  customs?: string[];
  greetings?: string; // How they say hello
  socialStructure?: string; // Hierarchy, classes, etc.

  // Language & Naming
  language?: string;
  namingConventions?: string; // How names work ("given-family", "clan-given", etc.)
  commonNames?: {
    given?: string[];
    family?: string[];
    other?: string[]; // Clan names, titles, etc.
  };

  // Occupations
  typicalOccupations?: string[];

  // Distribution
  homelandIds?: LocationId[];

  // Associated ancestries
  typicalAncestryIds?: AncestryId[];

  // Reference lore for deeper context
  loreIds?: LoreId[];

  // Escape hatch
  extra?: Record<string, string>;
}

/** Culture entity with typed properties */
export interface Culture extends Entity<CultureId, CultureProperties> {
  type: 'culture';
}
