/**
 * Character Entity Type
 *
 * Represents PCs, NPCs, creatures, and other beings with the AIRP stat system.
 */

import type { Entity } from './entity.js';
import type { CharacterId, CharacterCategoryId, AncestryId, CultureId, LocationId } from './ids.js';
import type { Trait } from './trait.js';

// =============================================================================
// Stats & Measures
// =============================================================================

/**
 * Character stats
 * Scale: 1-10, Average human: 2
 */
export interface CharacterStats {
  // Physical
  str: number; // Strength
  dex: number; // Dexterity
  tgh: number; // Toughness

  // Social
  chr: number; // Charisma
  wts: number; // Wits
  cmp: number; // Composure

  // Mental
  knw: number; // Knowledge
  itn: number; // Intuition
  det: number; // Determination
}

/**
 * Damage tracks derived from stats
 * At 0: character is "taken out" in that domain
 */
export interface CharacterMeasures {
  health: number; // tgh + 1 (Physical damage)
  standing: number; // cmp + 1 (Social damage)
  resolve: number; // det + 1 (Mental damage)
}

// =============================================================================
// Character Properties
// =============================================================================

/** Character-specific properties */
export interface CharacterProperties {
  // Core identity
  ancestryId?: AncestryId;
  cultureId?: CultureId;

  // Traits (persistent and temporary)
  traits: Trait[];

  // Level - determines mechanical limits (default: 2 = average person)
  level: number;

  // Stats (all characters have these)
  stats: CharacterStats;
  measures: CharacterMeasures;

  // Minion flag - if true, all measures are 1 and max 1 permanent trait
  isMinion?: boolean;

  // Narrative
  goals?: string[];
  secrets?: string[];
  fears?: string[];

  // Current state
  locationId?: LocationId;

  // Escape hatch
  extra?: Record<string, string>;
}

// =============================================================================
// Character Entity
// =============================================================================

/** Character entity with typed properties */
export interface Character extends Entity<CharacterId, CharacterProperties> {
  type: 'character';
  categoryId: CharacterCategoryId; // References CharacterCategory lookup table
}

// =============================================================================
// Constants
// =============================================================================

/** Default level for average person */
export const DEFAULT_CHARACTER_LEVEL = 2;

// =============================================================================
// Helper Functions
// =============================================================================

/** Stat category for simplified generation */
export type StatCategory = 'physical' | 'social' | 'mental';

/**
 * Generate stats for a simple character from level and primary category.
 * Use this when creating minor NPCs or minions quickly.
 *
 * In-category stats = level
 * Out-of-category stats = ceil(level / 2)
 */
export function generateSimpleStats(level: number, primaryCategory: StatCategory): CharacterStats {
  const inCategory = level;
  const outOfCategory = Math.ceil(level / 2);

  return {
    // Physical
    str: primaryCategory === 'physical' ? inCategory : outOfCategory,
    dex: primaryCategory === 'physical' ? inCategory : outOfCategory,
    tgh: primaryCategory === 'physical' ? inCategory : outOfCategory,
    // Social
    chr: primaryCategory === 'social' ? inCategory : outOfCategory,
    wts: primaryCategory === 'social' ? inCategory : outOfCategory,
    cmp: primaryCategory === 'social' ? inCategory : outOfCategory,
    // Mental
    knw: primaryCategory === 'mental' ? inCategory : outOfCategory,
    itn: primaryCategory === 'mental' ? inCategory : outOfCategory,
    det: primaryCategory === 'mental' ? inCategory : outOfCategory,
  };
}

/**
 * Calculate measures from stats
 * Minions always have 1 in all measures regardless of stats
 */
export function calculateMeasures(
  stats: CharacterStats,
  isMinion: boolean = false
): CharacterMeasures {
  if (isMinion) {
    return { health: 1, standing: 1, resolve: 1 };
  }
  return {
    health: stats.tgh + 1,
    standing: stats.cmp + 1,
    resolve: stats.det + 1,
  };
}

/**
 * Get max stat value for a character based on level
 * Formula TBD - level gates power ceiling
 */
export function getMaxStatValue(level: number): number {
  return level + 2; // e.g., level 2 → max stat 4, level 5 → max stat 7
}

/**
 * Get max permanent traits for a character
 * Minions: 1 (regardless of level)
 * Everyone else: based on level
 */
export function getMaxPermanentTraits(level: number, isMinion: boolean): number {
  if (isMinion) return 1;
  return Math.floor(level / 2) + 1; // e.g., level 2 → 2 traits, level 5 → 3 traits
}

/**
 * Create a simple character (minor NPC or minion) with generated stats
 */
export function createSimpleCharacter(
  level: number = DEFAULT_CHARACTER_LEVEL,
  primaryCategory: StatCategory,
  isMinion: boolean = false
): Pick<CharacterProperties, 'level' | 'stats' | 'measures' | 'isMinion' | 'traits'> {
  const stats = generateSimpleStats(level, primaryCategory);
  const measures = calculateMeasures(stats, isMinion);

  return {
    level,
    stats,
    measures,
    isMinion: isMinion || undefined,
    traits: [],
  };
}

/**
 * Count permanent traits on a character
 */
export function countPermanentTraits(character: Character): number {
  return character.properties.traits.filter((t) => !t.temporary).length;
}

/**
 * Check if a character can add another permanent trait
 */
export function canAddPermanentTrait(character: Character): boolean {
  const max = getMaxPermanentTraits(
    character.properties.level,
    character.properties.isMinion ?? false
  );
  return countPermanentTraits(character) < max;
}
