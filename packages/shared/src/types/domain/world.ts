import type { WorldId } from '../ids';

/**
 * World - A container for all entities, schemas, and relationships
 * Each user can have multiple worlds
 */
export interface World {
  id: WorldId;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
