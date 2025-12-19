import { World } from '../../domain/world/world';
import type { IWorldRepository } from '../../domain/world/world.repository';
import { userId, type UserId } from '../../domain/shared/ids';
import { ConflictError } from '../errors';
import { createWorldInputSchema } from './world.schemas';

/**
 * Input for CreateWorldUseCase
 */
export interface CreateWorldParams {
  ownerId: UserId;
  name: string;
  description?: string;
}

/**
 * Use case for creating a new world
 *
 * Responsibilities:
 * - Validate input
 * - Check for duplicate world names
 * - Create and persist the world entity
 */
export class CreateWorldUseCase {
  constructor(private readonly worldRepository: IWorldRepository) {}

  /**
   * Execute the use case
   * @param params - The world creation parameters
   * @returns The created world entity
   * @throws ConflictError if a world with the same name already exists
   * @throws ZodError if input validation fails
   */
  async execute(params: CreateWorldParams): Promise<World> {
    // Validate and transform input
    const validated = createWorldInputSchema.parse({
      ownerId: params.ownerId,
      name: params.name,
      description: params.description,
    });

    // Check for duplicate name
    const nameExists = await this.worldRepository.existsByName(validated.name);
    if (nameExists) {
      throw new ConflictError('World', 'name', validated.name);
    }

    // Create the domain entity
    const world = World.create({
      ownerId: userId(validated.ownerId),
      name: validated.name,
      description: validated.description,
    });

    // Persist
    await this.worldRepository.save(world);

    return world;
  }
}
