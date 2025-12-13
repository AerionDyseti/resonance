import type { World } from '../../domain/world/world';
import type { IWorldRepository } from '../../domain/world/world.repository';
import { worldId, type WorldId } from '../../domain/shared/ids';
import { NotFoundError, ConflictError } from '../errors';
import { updateWorldInputSchema } from './world.schemas';

/**
 * Input for UpdateWorldUseCase
 */
export interface UpdateWorldParams {
  id: WorldId;
  name?: string;
  description?: string | null;
}

/**
 * Use case for updating an existing world
 */
export class UpdateWorldUseCase {
  constructor(private readonly worldRepository: IWorldRepository) {}

  /**
   * Execute the use case
   * @param params - The world update parameters
   * @returns The updated world entity
   * @throws NotFoundError if the world doesn't exist
   * @throws ConflictError if the new name conflicts with an existing world
   */
  async execute(params: UpdateWorldParams): Promise<World> {
    // Validate and transform input
    const validated = updateWorldInputSchema.parse({
      id: params.id,
      name: params.name,
      description: params.description,
    });

    const id = worldId(validated.id);

    // Find existing world
    const world = await this.worldRepository.findById(id);
    if (!world) {
      throw new NotFoundError('World', id);
    }

    // Check for name conflict if name is being changed
    if (validated.name !== undefined) {
      const nameExists = await this.worldRepository.existsByName(validated.name, id);
      if (nameExists) {
        throw new ConflictError('World', 'name', validated.name);
      }
    }

    // Apply updates
    world.update({
      name: validated.name,
      description: validated.description,
    });

    // Persist
    await this.worldRepository.save(world);

    return world;
  }
}
