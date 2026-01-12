/**
 * Organization Entity Type
 *
 * Represents factions, guilds, governments, and groups.
 */

import type { Entity } from './entity.js';
import type { OrganizationId, OrganizationCategoryId, LocationId, EventId } from './ids.js';

/** Organization-specific properties */
export interface OrganizationProperties {
  // Description (for embedding)
  description?: string;

  // Classification (lookup table)
  categoryId?: OrganizationCategoryId;

  // Structure & Scale
  structure?: string; // How it's organized (hierarchy, council, etc.)
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'vast';
  influence?: number; // 1-5 regional/world power scale
  headquarters?: LocationId;

  // Agenda
  goals?: string[];
  resources?: string[]; // What they control/have access to
  publicPerception?: string; // How outsiders see them

  // Hidden
  secrets?: string[];

  // Origin
  foundedAt?: EventId;

  // Escape hatch
  extra?: Record<string, string>;
}

/** Organization entity with typed properties */
export interface Organization extends Entity<OrganizationId, OrganizationProperties> {
  type: 'organization';
}
