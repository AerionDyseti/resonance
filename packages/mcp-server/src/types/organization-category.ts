/**
 * OrganizationCategory - Defines categories of organizations
 *
 * Stored in DB so LLMs can query available categories and maintain consistency.
 */

import type { OrganizationCategoryId } from './ids.js';

export interface OrganizationCategory {
  id: OrganizationCategoryId;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Default organization categories to seed the database
 */
export const DEFAULT_ORGANIZATION_CATEGORIES: Omit<
  OrganizationCategory,
  'id' | 'createdAt' | 'updatedAt'
>[] = [
  { name: 'faction', description: 'Political or ideological group' },
  { name: 'guild', description: 'Professional or trade association' },
  { name: 'government', description: 'Ruling body or administration' },
  { name: 'religion', description: 'Religious institution or church' },
  { name: 'family', description: 'Noble house or bloodline' },
  { name: 'company', description: 'Commercial enterprise' },
  { name: 'military', description: 'Armed force or knightly order' },
  { name: 'secret_society', description: 'Clandestine organization' },
  { name: 'criminal', description: 'Thieves guild, cartel, syndicate' },
  { name: 'academic', description: 'School, university, research body' },
  { name: 'cult', description: 'Devoted followers of a deity or cause' },
  { name: 'tribe', description: 'Nomadic or clan-based group' },
];
