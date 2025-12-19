import type { IWorldRepository } from '../../domain/world/world.repository';
import type { WorldId } from '../../domain/shared/ids';
import { NotFoundError } from '../errors';

/**
 * Use case for deleting a world
 *
 * Note: This performs a hard delete. The database cascade
 * will remove all related entities, relationships, etc.
 */
export class DeleteWorldUseCase {
  constructor(private readonly worldRepository: IWorldRepository) {}

  /**
   * Execute the use case
   * @param id - The world ID to delete
   * @throws NotFoundError if the world doesn't exist
   */
  async execute(id: WorldId): Promise<void> {
    const deleted = await this.worldRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError('World', id);
    }
  }
}
