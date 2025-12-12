import type { IWorldRepository } from '../../../domain/repositories/world.repository';
import { World } from '../../../domain/entities/world.entity';
import type { CreateWorldInput, CreateWorldOutput } from '../../dto/world.dto';

/**
 * Create World Use Case
 *
 * Orchestrates the creation of a new world.
 * Validates business rules and coordinates with the repository.
 */
export class CreateWorldUseCase {
  constructor(private readonly worldRepository: IWorldRepository) {}

  async execute(input: CreateWorldInput): Promise<CreateWorldOutput> {
    // Check if a world with this name already exists
    const exists = await this.worldRepository.existsByName(input.name);
    if (exists) {
      throw new Error(`World with name "${input.name}" already exists`);
    }

    // Create domain entity (enforces business rules)
    const world = World.create({
      name: input.name,
      description: input.description,
    });

    // Persist via repository
    await this.worldRepository.save(world);

    // Return DTO
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
