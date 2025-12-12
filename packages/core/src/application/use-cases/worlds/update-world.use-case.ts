import type { IWorldRepository } from '../../../domain/repositories/world.repository';
import type { UpdateWorldInput, UpdateWorldOutput } from '../../dto/world.dto';

/**
 * Update World Use Case
 *
 * Updates an existing world's properties.
 */
export class UpdateWorldUseCase {
  constructor(private readonly worldRepository: IWorldRepository) {}

  async execute(input: UpdateWorldInput): Promise<UpdateWorldOutput> {
    // Find existing world
    const world = await this.worldRepository.findById(input.id);
    if (!world) {
      throw new Error(`World with ID "${input.id}" not found`);
    }

    // Check name uniqueness if name is being changed
    if (input.name && input.name !== world.name) {
      const exists = await this.worldRepository.existsByName(input.name, input.id);
      if (exists) {
        throw new Error(`World with name "${input.name}" already exists`);
      }
    }

    // Update domain entity (enforces business rules)
    world.update({
      name: input.name,
      description: input.description,
    });

    // Persist changes
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
