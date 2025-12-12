import express from 'express';
import type { Express } from 'express';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Resonance backend server running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}`);
});

export default app;
