import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@resonance/backend/src/trpc/appRouter';

// Create tRPC client
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
});

// Export types for use in components
export type { AppRouter };
