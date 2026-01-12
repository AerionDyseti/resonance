/**
 * Location Entity Type
 *
 * Represents places in the world with spatial hierarchy.
 */

import type { Entity } from './entity.js';
import type { LocationId, CharacterId } from './ids.js';

/**
 * Location scale hierarchy (smallest to largest)
 *
 * - subsite: A single room or section of a site
 * - site: A single location, such as a building or point of interest
 * - area: A single locale, usually with multiple sites within
 * - district: A subdivision of a city containing related sites
 * - city: A geographic settlement within a region
 * - region: An administrative area within a nation/continent containing multiple cities
 * - nation: A political territory within a continent comprising connected regions
 * - continent: A major landmass containing multiple nations
 * - plane: The entirety of one plane of existence
 * - stratum: A fundamental layer of the cosmology; each operates by its own internal
 *            logic, with planes within the same stratum interacting more readily than
 *            those between different strata
 */
export type LocationScale =
  | 'subsite'
  | 'site'
  | 'area'
  | 'district'
  | 'city'
  | 'region'
  | 'nation'
  | 'continent'
  | 'plane'
  | 'stratum';

/** Location-specific properties */
export interface LocationProperties {
  // Hierarchy
  scale: LocationScale;
  parentLocationId?: LocationId;

  // Description
  description?: string;
  atmosphere?: string;
  notableFeatures?: string[];

  // Occupancy
  inhabitants?: CharacterId[];
  currentOccupants?: CharacterId[];

  // Hidden information
  secrets?: string[];
}

/** Location entity with typed properties */
export interface Location extends Entity<LocationId, LocationProperties> {
  type: 'location';
}
