import type { World } from '../../domain/world/world';
import type { IWorldRepository } from '../../domain/world/world.repository';
import type { WorldId } from '../../domain/shared/ids';
import { NotFoundError } from '../errors';

/**
 * Use case for retrieving a single world by ID
 */
export class GetWorldUseCase {
  constructor(private readonly worldRepository: IWorldRepository) {}

  /**
   * Execute the use case
   * @param id - The world ID to retrieve
   * @returns The world entity
   * @throws NotFoundError if the world doesn't exist
   */
  async execute(id: WorldId): Promise<World> {
    const world = await this.worldRepository.findById(id);

    if (!world) {
      throw new NotFoundError('World', id);
    }

    return world;
  }
}
