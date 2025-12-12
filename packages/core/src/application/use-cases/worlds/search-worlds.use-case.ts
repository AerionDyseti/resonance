import type { IWorldRepository } from '../../../domain/repositories/world.repository';
import type { SearchWorldsInput, WorldListOutput } from '../../dto/world.dto';

/**
 * Search Worlds Use Case
 *
 * Searches worlds by name (case-insensitive partial match).
 */
export class SearchWorldsUseCase {
  constructor(private readonly worldRepository: IWorldRepository) {}

  async execute(input: SearchWorldsInput): Promise<WorldListOutput> {
    const [worlds, total] = await Promise.all([
      this.worldRepository.searchByName(input.searchTerm, {
        limit: input.limit,
        offset: input.offset,
      }),
      this.worldRepository.count(), // Note: This returns total count, not filtered count
    ]);

    return {
      worlds: worlds.map((world) => ({
        id: world.id,
        name: world.name,
        description: world.description,
        createdAt: world.createdAt,
        updatedAt: world.updatedAt,
        isNew: world.isNew(),
      })),
      total, // In production, you'd want a separate searchCount method
      limit: input.limit,
      offset: input.offset,
    };
  }
}
