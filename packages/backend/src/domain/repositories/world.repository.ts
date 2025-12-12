import type { WorldId } from '../value-objects/ids';
import type { World } from '../models/world';

/**
 * World Repository Interface (Port)
 *
 * Defines the contract for world persistence operations.
 * The domain layer defines this interface, and the infrastructure layer implements it.
 * This follows the Dependency Inversion Principle - high-level domain logic
 * doesn't depend on low-level infrastructure details.
 */
export interface IWorldRepository {
  /**
   * Find a world by its unique identifier
   * @param id - The world ID
   * @returns The world entity if found, null otherwise
   */
  findById(id: WorldId): Promise<World | null>;

  /**
   * Find all worlds with optional pagination
   * @param params - Optional pagination parameters
   * @returns Array of world entities
   */
  findAll(params?: { limit?: number; offset?: number }): Promise<World[]>;

  /**
   * Get total count of worlds
   * Useful for pagination
   * @returns Total number of worlds
   */
  count(): Promise<number>;

  /**
   * Check if a world with the given name already exists
   * @param name - The world name to check
   * @param excludeId - Optional world ID to exclude from the check (for updates)
   * @returns True if a world with this name exists, false otherwise
   */
  existsByName(name: string, excludeId?: WorldId): Promise<boolean>;

  /**
   * Save a world (create or update)
   * If the world.id doesn't exist in database, creates a new record.
   * If it exists, updates the existing record.
   * @param world - The world entity to save
   */
  save(world: World): Promise<void>;

  /**
   * Delete a world by its ID
   * @param id - The world ID to delete
   * @returns True if the world was deleted, false if it didn't exist
   */
  delete(id: WorldId): Promise<boolean>;

  /**
   * Search worlds by name (case-insensitive partial match)
   * @param searchTerm - The search term
   * @param params - Optional pagination parameters
   * @returns Array of matching world entities
   */
  searchByName(
    searchTerm: string,
    params?: {
      limit?: number;
      offset?: number;
    }
  ): Promise<World[]>;
}
