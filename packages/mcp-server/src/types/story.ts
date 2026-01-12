/**
 * Story Entity Type
 *
 * Represents plot threads, quests, and narrative arcs.
 */

import type { Entity } from './entity.js';
import type { StoryId, CharacterId, LocationId, SessionId } from './ids.js';

/** Story status */
export type StoryStatus = 'active' | 'resolved' | 'abandoned';

/** Story-specific properties */
export interface StoryProperties {
  // Description (for embedding)
  description?: string;

  // Status
  status: StoryStatus;
  resolution?: string; // How it ended (if resolved/abandoned)

  // Stakes & Drama
  stakes?: string;
  threads?: string[]; // Sub-plots or complications

  // Participants & Locations
  involvedCharacterIds?: CharacterId[];
  keyLocationIds?: LocationId[];

  // Session tracking
  sessionIds?: SessionId[]; // All sessions this story appeared in

  // Escape hatch
  extra?: Record<string, string>;
}

/** Story entity with typed properties */
export interface Story extends Entity<StoryId, StoryProperties> {
  type: 'story';
}
