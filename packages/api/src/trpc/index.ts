import { initTRPC } from '@trpc/server';
import { ZodError } from 'zod';
import type { ApiContext } from '../context';

// Create a reusable t-object for building routers with typed context
export const t = initTRPC.context<ApiContext>().create({
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
