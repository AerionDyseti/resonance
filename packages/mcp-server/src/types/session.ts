/**
 * Session Entity Type
 *
 * Represents session summaries and logs.
 * Tracks what happened and what entities were introduced or expanded.
 */

import type { Entity } from './entity.js';
import type {
  SessionId,
  StoryId,
  SceneId,
  CharacterId,
  LocationId,
  OrganizationId,
  ItemId,
  EventId,
  LoreId,
  AncestryId,
  CultureId,
} from './ids.js';

/** Session-specific properties */
export interface SessionProperties {
  // Description (for embedding)
  description?: string; // Summary of what happened

  // Session metadata
  sessionNumber: number;
  date?: string; // Real-world date
  pcId?: CharacterId; // Which PC was played this session

  // What happened
  keyEvents: string[];
  decisionsMade?: string[];
  cliffhanger?: string; // How the session ended

  // Stories this session is part of
  storyIds?: StoryId[];

  // Scenes played
  sceneIds?: SceneId[];

  // Entities introduced or expanded
  charactersIntroduced?: CharacterId[];
  charactersExpanded?: CharacterId[];
  locationsVisited?: LocationId[];
  locationsIntroduced?: LocationId[];
  organizationsMentioned?: OrganizationId[];
  itemsAcquired?: ItemId[];
  itemsLost?: ItemId[];
  itemsMentioned?: ItemId[];
  eventsOccurred?: EventId[];
  loreDiscovered?: LoreId[];
  ancestriesMentioned?: AncestryId[];
  culturesMentioned?: CultureId[];

  // Escape hatch
  extra?: Record<string, string>;
}

/** Session entity with typed properties */
export interface Session extends Entity<SessionId, SessionProperties> {
  type: 'session';
}
