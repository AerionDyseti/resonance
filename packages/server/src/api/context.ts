import type { ApiContext } from '@resonance/api';
import { db } from '../infrastructure/database/client';
import { DrizzleWorldRepository } from '../infrastructure/database/repositories/world.repository.impl';

/**
 * Server-side context factory.
 *
 * This is the composition root for request-scoped dependencies.
 * It returns the ApiContext expected by @resonance/api routers.
 */
export const createContext = (): ApiContext => {
  return {
    worldRepository: new DrizzleWorldRepository(db),
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
