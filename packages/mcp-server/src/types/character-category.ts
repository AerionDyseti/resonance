/**
 * CharacterCategory - Defines categories of characters
 *
 * Stored in DB so LLMs can query available categories and maintain consistency.
 * Purely narrative/role-based, not mechanical.
 */

import type { CharacterCategoryId } from './ids.js';

export interface CharacterCategory {
  id: CharacterCategoryId;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Default character categories to seed the database
 */
export const DEFAULT_CHARACTER_CATEGORIES: Omit<
  CharacterCategory,
  'id' | 'createdAt' | 'updatedAt'
>[] = [
  { name: 'pc', description: 'Player character' },
  { name: 'major_npc', description: 'Important NPC with full development' },
  { name: 'minor_npc', description: 'Background NPC' },
  { name: 'companion', description: 'Allied NPC who travels with the party' },
  { name: 'villain', description: 'Primary antagonist' },
  { name: 'patron', description: 'Quest giver or benefactor' },
  { name: 'deity', description: 'God or divine entity' },
  { name: 'spirit', description: 'Incorporeal or supernatural being' },
  { name: 'creature', description: 'Monster or beast' },
];
