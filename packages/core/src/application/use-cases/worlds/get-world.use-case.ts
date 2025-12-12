import type { IWorldRepository } from '../../../domain/repositories/world.repository';
import type { GetWorldInput, WorldOutput } from '../../dto/world.dto';

/**
 * Get World Use Case
 *
 * Retrieves a single world by its ID.
 */
export class GetWorldUseCase {
  constructor(private readonly worldRepository: IWorldRepository) {}

  async execute(input: GetWorldInput): Promise<WorldOutput | null> {
    const world = await this.worldRepository.findById(input.id);

    if (!world) {
      return null;
    }

    return {
      id: world.id,
      name: world.name,
      description: world.description,
      createdAt: world.createdAt,
      updatedAt: world.updatedAt,
      isNew: world.isNew(),
    };
  }
}
