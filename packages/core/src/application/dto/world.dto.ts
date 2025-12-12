import type { WorldId } from '@resonance/shared';

/**
 * Data Transfer Objects for World operations
 *
 * DTOs define the contract between the API layer and the application layer.
 * They are simple data structures without business logic.
 */

// ============================================================================
// Input DTOs (Commands/Queries)
// ============================================================================

export interface CreateWorldInput {
  name: string;
  description?: string;
}

export interface UpdateWorldInput {
  id: WorldId;
  name?: string;
  description?: string | null;
}

export interface GetWorldInput {
  id: WorldId;
}

export interface DeleteWorldInput {
  id: WorldId;
}

export interface ListWorldsInput {
  limit?: number;
  offset?: number;
}

export interface SearchWorldsInput {
  searchTerm: string;
  limit?: number;
  offset?: number;
}

// ============================================================================
// Output DTOs (Results)
// ============================================================================

export interface WorldOutput {
  id: WorldId;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  isNew: boolean; // Computed property from domain logic
}

export interface WorldListOutput {
  worlds: WorldOutput[];
  total: number;
  limit?: number;
  offset?: number;
}

export type CreateWorldOutput = WorldOutput;

export type UpdateWorldOutput = WorldOutput;

export interface DeleteWorldOutput {
  success: boolean;
  id: WorldId;
}
