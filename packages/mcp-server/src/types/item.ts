/**
 * Item Entity Type
 *
 * Represents equipment, artifacts, and significant objects.
 */

import type { Entity } from './entity.js';
import type { ItemId, CharacterId, LocationId } from './ids.js';

/** Item-specific properties */
export interface ItemProperties {
  // Description (for embedding)
  description?: string;

  // Significance
  significance?: string; // Why it matters

  // Location
  currentHolderId?: CharacterId; // Who has it
  locationId?: LocationId; // Where it is (if not held)

  // Origin & History
  origin?: string; // Where it came from
  history?: string[]; // Key events involving the item

  // Properties
  powers?: string[]; // Magical or special properties
  value?: string; // Worth (can be narrative not numeric)

  // Escape hatch
  extra?: Record<string, string>;
}

/** Item entity with typed properties */
export interface Item extends Entity<ItemId, ItemProperties> {
  type: 'item';
}
