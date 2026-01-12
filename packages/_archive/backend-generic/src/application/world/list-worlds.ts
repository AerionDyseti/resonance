import type { World } from '../../domain/world/world';
import type { IWorldRepository } from '../../domain/world/world.repository';
import { listWorldsInputSchema, type ListWorldsInput } from './world.schemas';

/**
 * Result of the ListWorlds use case
 */
export interface ListWorldsResult {
  worlds: World[];
  total: number;
}

/**
 * Use case for listing worlds with pagination
 */
export class ListWorldsUseCase {
  constructor(private readonly worldRepository: IWorldRepository) {}

  /**
   * Execute the use case
   * @param params - Optional pagination parameters
   * @returns List of worlds and total count
   */
  async execute(params?: Partial<ListWorldsInput>): Promise<ListWorldsResult> {
    // Apply defaults via schema
    const validated = listWorldsInputSchema.parse(params ?? {});

    const [worlds, total] = await Promise.all([
      this.worldRepository.findAll({ limit: validated.limit, offset: validated.offset }),
      this.worldRepository.count(),
    ]);

    return { worlds, total };
  }
}
