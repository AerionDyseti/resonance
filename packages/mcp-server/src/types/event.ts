/**
 * Event Entity Type
 *
 * Represents specific happenings - historical or during play.
 */

import type { Entity } from './entity.js';
import type { EventId, LocationId, EntityId, SessionId } from './ids.js';

/** Event-specific properties */
export interface EventProperties {
  // Description (for embedding)
  description?: string;

  // When & Where
  when?: string; // When it happened (can be vague: "Third Age", "last winter")
  locationId?: LocationId;

  // Participants
  involvedEntityIds?: EntityId[];

  // Results
  outcome?: string;
  consequences?: string[];

  // Play tracking
  sessionId?: SessionId; // If it happened during play

  // Escape hatch
  extra?: Record<string, string>;
}

/** Event entity with typed properties */
export interface Event extends Entity<EventId, EventProperties> {
  type: 'event';
}
