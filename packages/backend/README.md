# Resonance Backend

Express + tRPC API server with PostgreSQL + pgvector for vector search.

## Prerequisites

- Node.js 20+
- PostgreSQL 15+ with pgvector extension
- Docker (optional, for local development)

## Setup

### 1. Database Setup

#### Option A: Using Docker (recommended for local dev)

```bash
# From project root
docker compose up -d
```

This starts PostgreSQL 17 with pgvector extension on port 5432.

#### Option B: Manual PostgreSQL setup

Install PostgreSQL and the pgvector extension:

```bash
# On Ubuntu/Debian
sudo apt-get install postgresql-15 postgresql-15-pgvector

# On macOS (Homebrew)
brew install postgresql@15 pgvector
```

Create the database:

```sql
CREATE DATABASE resonance;
\c resonance
CREATE EXTENSION vector;
```

### 2. Environment Configuration

Copy the example environment file:

```bash
cd packages/backend
cp .env.example .env
```

Update `DATABASE_URL` if needed (defaults to Docker setup):

```
DATABASE_URL=postgresql://resonance:resonance_dev@localhost:5432/resonance
```

### 3. Run Migrations

```bash
npm run db:push
```

This applies the database schema with pgvector support.

## Development

```bash
# Start dev server with hot reload
npm run dev

# Type checking
npm run type-check

# Run tests
npm run test
```

## Database Management

```bash
# Generate new migration after schema changes
npm run db:generate

# Push schema changes (for development)
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## Vector Search

The backend uses **pgvector** for semantic search on entity embeddings:

- **Embedding dimension**: 1536 (OpenAI text-embedding-3-small/ada-002)
- **Distance metrics**: L2, cosine, inner product
- **Index type**: HNSW (created automatically by pgvector)

Example query:

```typescript
import { db } from './db/client';
import { entities } from './db/schema';
import { cosineDistance } from './db/vector';

const results = await db
  .select()
  .from(entities)
  .orderBy(cosineDistance(entities.embedding, queryEmbedding))
  .limit(10);
```

## Production Deployment

1. Set up PostgreSQL 15+ with pgvector extension
2. Configure `DATABASE_URL` environment variable
3. Run migrations: `npm run db:push`
4. Build: `npm run build`
5. Start: `npm start`
