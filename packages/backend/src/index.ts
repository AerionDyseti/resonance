import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import type { Express } from 'express';

import { appRouter } from './trpc/appRouter.js';
import { env } from './config/env.js';

const app: Express = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: env.CORS_ORIGINS.split(',').map((o) => o.trim()),
  })
);

// tRPC API route
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({}),
  })
);

// Health check REST endpoint (fallback)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Resonance backend server running on port ${env.PORT}`);
  // eslint-disable-next-line no-console
  console.log(`📝 tRPC API available at http://localhost:${env.PORT}/api/trpc`);
});

export default app;
