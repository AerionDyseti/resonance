import { describe, it, expect, mock } from 'bun:test';
import { appRouter } from './appRouter';
import type { ApiContext } from './context';
import type { IWorldRepository } from '@resonance/core';

// Create a mock world repository
const mockWorldRepository: IWorldRepository = {
  findById: mock(() => Promise.resolve(null)),
  findAll: mock(() => Promise.resolve([])),
  count: mock(() => Promise.resolve(0)),
  existsByName: mock(() => Promise.resolve(false)),
  save: mock(() => Promise.resolve()),
  delete: mock(() => Promise.resolve(false)),
  searchByName: mock(() => Promise.resolve([])),
};

// Create a mock context
const mockContext: ApiContext = {
  worldRepository: mockWorldRepository,
};

describe('appRouter', () => {
  describe('health query', () => {
    it('returns ok status', async () => {
      const caller = appRouter.createCaller(mockContext);
      const result = await caller.health();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
    });

    it('returns valid ISO timestamp', async () => {
      const caller = appRouter.createCaller(mockContext);
      const result = await caller.health();

      const timestamp = new Date(result.timestamp);
      expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
      expect(timestamp.getTime()).toBeGreaterThan(Date.now() - 5000); // Within last 5 seconds
    });
  });
});
