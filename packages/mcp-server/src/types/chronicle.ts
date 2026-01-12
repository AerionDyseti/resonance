/**
 * Chronicle Entity Type
 *
 * Represents a campaign/story setting. All other entities belong to a chronicle.
 * The chronicle's own chronicleId references itself.
 */

import type { Entity } from './entity.js';
import type { ChronicleId, CharacterId, SessionId, StoryId } from './ids.js';

/** Chronicle status */
export type ChronicleStatus = 'active' | 'completed' | 'abandoned' | 'paused';

/** Chronicle-specific properties */
export interface ChronicleProperties {
  // Description (for embedding)
  description?: string;

  // Setting
  setting?: string; // Brief world description

  // Status
  status: ChronicleStatus;

  // Player characters
  pcIds?: CharacterId[];

  // Content tracking
  sessionIds?: SessionId[];
  storyIds?: StoryId[];

  // Real-world dates
  startDate?: string;
  endDate?: string;

  // Escape hatch
  extra?: Record<string, string>;
}

/** Chronicle entity with typed properties */
export interface Chronicle extends Entity<ChronicleId, ChronicleProperties> {
  type: 'chronicle';
}
