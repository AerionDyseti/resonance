import { initTRPC } from '@trpc/server';
import { ZodError } from 'zod';

// Create a reusable t-object for building routers
export const t = initTRPC.create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// Export commonly used server utilities
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
