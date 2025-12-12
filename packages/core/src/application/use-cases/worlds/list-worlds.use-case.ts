import type { IWorldRepository } from '../../../domain/repositories/world.repository';
import type { ListWorldsInput, WorldListOutput } from '../../dto/world.dto';

/**
 * List Worlds Use Case
 *
 * Retrieves a paginated list of all worlds.
 */
export class ListWorldsUseCase {
  constructor(private readonly worldRepository: IWorldRepository) {}

  async execute(input: ListWorldsInput): Promise<WorldListOutput> {
    const [worlds, total] = await Promise.all([
      this.worldRepository.findAll({
        limit: input.limit,
        offset: input.offset,
      }),
      this.worldRepository.count(),
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
      total,
      limit: input.limit,
      offset: input.offset,
    };
  }
}
