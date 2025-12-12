import { describe, it, expect } from 'vitest';
import { appRouter } from './appRouter';

describe('appRouter', () => {
  describe('health query', () => {
    it('returns ok status', async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.health();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
    });

    it('returns valid ISO timestamp', async () => {
      const caller = appRouter.createCaller({});
      const result = await caller.health();

      const timestamp = new Date(result.timestamp);
      expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
      expect(timestamp.getTime()).toBeGreaterThan(Date.now() - 5000); // Within last 5 seconds
    });
  });
});
