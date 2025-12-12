import type { IWorldRepository } from '../../../domain/repositories/world.repository';
import type { DeleteWorldInput, DeleteWorldOutput } from '../../dto/world.dto';

/**
 * Delete World Use Case
 *
 * Deletes a world by its ID.
 *
 * Note: In a real application, you might want to:
 * - Check if the world has associated entities before deletion
 * - Implement soft delete instead of hard delete
 * - Add authorization checks
 */
export class DeleteWorldUseCase {
  constructor(private readonly worldRepository: IWorldRepository) {}

  async execute(input: DeleteWorldInput): Promise<DeleteWorldOutput> {
    const deleted = await this.worldRepository.delete(input.id);

    return {
      success: deleted,
      id: input.id,
    };
  }
}
