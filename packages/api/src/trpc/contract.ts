// tRPC contract surface for external consumers (e.g. frontend).
//
// IMPORTANT:
// - This module must stay free of runtime side effects.
// - Keep exports type-only so importing it doesn't require runtime dependencies.

export type { AppRouter } from '../appRouter';
