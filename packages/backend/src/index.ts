import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/express';
import type { Express } from 'express';

import { appRouter } from './trpc/appRouter';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

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
app.listen(PORT, () => {
  console.log(`🚀 Resonance backend server running on port ${PORT}`);
  console.log(`📝 tRPC API available at http://localhost:${PORT}/api/trpc`);
});

export default app;
