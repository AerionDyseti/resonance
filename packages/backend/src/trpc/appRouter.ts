import { router, publicProcedure } from './index';

/**
 * Main tRPC app router
 * Contains all available procedures and sub-routers
 */
export const appRouter = router({
  // Health check procedure - returns server status
  health: publicProcedure.query(() => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })),
});

// Export type of router for use on the client
export type AppRouter = typeof appRouter;
