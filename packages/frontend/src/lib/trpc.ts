import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { TRPCClient } from '@trpc/client';
import type { AppRouter } from '@resonance/api/trpc';

// Vanilla tRPC client (for use in composables and direct calls)
export const trpc: TRPCClient<AppRouter> = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/trpc',
    }),
  ],
});

// Export types for use in components
export type { AppRouter };
