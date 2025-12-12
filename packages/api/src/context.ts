import type { IWorldRepository } from '@resonance/core';

/**
 * ApiContext
 *
 * Typed context for tRPC procedures.
 *
 * IMPORTANT: this must only reference ports (interfaces) and other core abstractions.
 * The server runtime ("@resonance/server") is responsible for constructing this context
 * using concrete infrastructure adapters.
 */
export interface ApiContext {
  worldRepository: IWorldRepository;
}
