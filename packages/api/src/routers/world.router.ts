import { z } from 'zod';
import { router, publicProcedure } from '../trpc/index';
import { worldId } from '@resonance/shared';
import {
  CreateWorldUseCase,
  DeleteWorldUseCase,
  GetWorldUseCase,
  ListWorldsUseCase,
  SearchWorldsUseCase,
  UpdateWorldUseCase,
} from '@resonance/core';
import { CreateWorldInput, UpdateWorldInput } from '../schemas/schemas';

/**
 * World Router (API Layer)
 *
 * Thin adapter that connects tRPC procedures to application use cases.
 * This layer is responsible for:
 * - Input validation (Zod schemas)
 * - Calling the appropriate use case
 * - Returning the result
 *
 * Business logic lives in the domain/application layers, not here.
 */
export const worldRouter = router({
  /**
   * Create a new world
   */
  create: publicProcedure.input(CreateWorldInput).mutation(async ({ input, ctx }) => {
    const useCase = new CreateWorldUseCase(ctx.worldRepository);
    return await useCase.execute(input);
  }),

  /**
   * Get a world by ID
   */
  getById: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .query(async ({ input, ctx }) => {
      const useCase = new GetWorldUseCase(ctx.worldRepository);
      const result = await useCase.execute({ id: worldId(input.id) });

      if (!result) {
        throw new Error(`World with ID "${input.id}" not found`);
      }

      return result;
    }),

  /**
   * List all worlds with optional pagination
   */
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).optional(),
        offset: z.number().min(0).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const useCase = new ListWorldsUseCase(ctx.worldRepository);
      return await useCase.execute(input);
    }),

  /**
   * Update an existing world
   */
  update: publicProcedure.input(UpdateWorldInput).mutation(async ({ input, ctx }) => {
    const useCase = new UpdateWorldUseCase(ctx.worldRepository);
    return await useCase.execute({
      id: worldId(input.id),
      name: input.name,
      description: input.description,
    });
  }),

  /**
   * Delete a world by ID
   */
  delete: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const useCase = new DeleteWorldUseCase(ctx.worldRepository);
      return await useCase.execute({ id: worldId(input.id) });
    }),

  /**
   * Search worlds by name
   */
  search: publicProcedure
    .input(
      z.object({
        searchTerm: z.string().min(1),
        limit: z.number().min(1).max(100).optional(),
        offset: z.number().min(0).optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const useCase = new SearchWorldsUseCase(ctx.worldRepository);
      return await useCase.execute(input);
    }),
});
