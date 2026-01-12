/**
 * Trait Type
 *
 * Traits represent advantages, disadvantages, and conditions.
 * They can be persistent (survive scene boundaries) or temporary (cleared at scene end).
 */

/** A character trait - advantage, disadvantage, or condition */
export interface Trait {
  /** Display name of the trait */
  name: string;

  /** If true, clears at end of scene. If false, persists until narratively removed. */
  temporary: boolean;

  /** Optional description or context for how it was gained */
  context?: string;

  /** Session number when this trait was acquired */
  acquiredSession?: number;
}

/** Create a persistent trait */
export function persistentTrait(name: string, context?: string): Trait {
  return { name, temporary: false, context };
}

/** Create a temporary trait (clears at scene end) */
export function temporaryTrait(name: string, context?: string): Trait {
  return { name, temporary: true, context };
}

/** Filter to only persistent traits */
export function getPersistentTraits(traits: Trait[]): Trait[] {
  return traits.filter((t) => !t.temporary);
}

/** Filter to only temporary traits */
export function getTemporaryTraits(traits: Trait[]): Trait[] {
  return traits.filter((t) => t.temporary);
}

/** Clear all temporary traits (called at scene end) */
export function clearTemporaryTraits(traits: Trait[]): Trait[] {
  return traits.filter((t) => !t.temporary);
}
