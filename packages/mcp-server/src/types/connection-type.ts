/**
 * ConnectionType - Defines kinds of connections between entities
 *
 * Stored in DB so LLMs can query available types and maintain consistency.
 * New types can be created but are tracked to prevent explosion.
 */

import type { ConnectionTypeId } from './ids.js';

/**
 * Categories for organizing connection types
 */
export type ConnectionCategory =
  | 'social' // Personal relationships (knows, loves, rivals)
  | 'familial' // Blood/legal family ties
  | 'organizational' // Membership, hierarchy (member_of, leads, serves)
  | 'spatial' // Location-based (located_in, resides_at)
  | 'ownership' // Possession (owns, carries, controls)
  | 'causal' // Creation/origin (created, caused)
  | 'narrative'; // Story involvement (involved_in, witnessed)

export interface ConnectionType {
  id: ConnectionTypeId;
  name: string; // Canonical name: 'mentors', 'rivals', 'located_in'
  description: string; // What this connection means
  category?: ConnectionCategory;

  // Suggested inverse for creating reciprocal connections
  // e.g., 'mentors' suggests 'mentored_by' for the reverse direction
  suggestedInverse?: string;

  createdAt: string;
  updatedAt: string;
}

/**
 * Default connection types to seed the database
 */
export const DEFAULT_CONNECTION_TYPES: Omit<ConnectionType, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Social
  { name: 'knows', description: 'Has met or is aware of', category: 'social' },
  {
    name: 'trusts',
    description: 'Has confidence in',
    category: 'social',
    suggestedInverse: 'trusted_by',
  },
  { name: 'distrusts', description: 'Lacks confidence in', category: 'social' },
  { name: 'loves', description: 'Has deep affection for', category: 'social' },
  { name: 'fears', description: 'Is afraid of', category: 'social' },
  { name: 'rivals', description: 'Competes with', category: 'social' },
  {
    name: 'mentors',
    description: 'Teaches or guides',
    category: 'social',
    suggestedInverse: 'mentored_by',
  },
  {
    name: 'respects',
    description: 'Holds in high regard',
    category: 'social',
    suggestedInverse: 'respected_by',
  },

  // Familial
  {
    name: 'parent_of',
    description: 'Biological or adoptive parent',
    category: 'familial',
    suggestedInverse: 'child_of',
  },
  { name: 'sibling_of', description: 'Shares parent(s) with', category: 'familial' },
  { name: 'married_to', description: 'Spouse or life partner', category: 'familial' },

  // Organizational
  { name: 'member_of', description: 'Belongs to organization/group', category: 'organizational' },
  {
    name: 'leads',
    description: 'Commands or directs',
    category: 'organizational',
    suggestedInverse: 'led_by',
  },
  {
    name: 'serves',
    description: 'Works for or under',
    category: 'organizational',
    suggestedInverse: 'served_by',
  },
  { name: 'allied_with', description: 'In alliance with', category: 'organizational' },
  { name: 'opposed_to', description: 'In conflict with', category: 'organizational' },

  // Spatial
  { name: 'located_in', description: 'Spatially contained within', category: 'spatial' },
  { name: 'resides_at', description: 'Lives or dwells at', category: 'spatial' },
  { name: 'originated_from', description: 'Came from or was born in', category: 'spatial' },

  // Ownership
  {
    name: 'owns',
    description: 'Has possession or control of',
    category: 'ownership',
    suggestedInverse: 'owned_by',
  },
  {
    name: 'carries',
    description: 'Currently has on person',
    category: 'ownership',
    suggestedInverse: 'carried_by',
  },
  {
    name: 'controls',
    description: 'Has authority over',
    category: 'ownership',
    suggestedInverse: 'controlled_by',
  },

  // Causal
  {
    name: 'created',
    description: 'Made or brought into being',
    category: 'causal',
    suggestedInverse: 'created_by',
  },
  {
    name: 'caused',
    description: 'Brought about or triggered',
    category: 'causal',
    suggestedInverse: 'caused_by',
  },
  {
    name: 'destroyed',
    description: 'Ended or eliminated',
    category: 'causal',
    suggestedInverse: 'destroyed_by',
  },

  // Narrative
  { name: 'involved_in', description: 'Participated in event/story', category: 'narrative' },
  { name: 'witnessed', description: 'Observed or was present for', category: 'narrative' },
  {
    name: 'seeks',
    description: 'Pursuing or searching for',
    category: 'narrative',
    suggestedInverse: 'sought_by',
  },
];
