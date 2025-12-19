# Resonance Architecture Guide

Complete documentation of the Resonance system architecture across domain, application, and infrastructure layers.

## 📚 Documentation Structure

### Core Domain Documentation

1. **[DOMAIN.md](./DOMAIN.md)** - Complete Domain Layer Overview
   - World and Entity aggregates
   - Schema definition system (EntityDefinition, PropertyDefinition, RelationshipDefinition)
   - Type-safe ID system (branded types)
   - Design patterns and principles
   - **Use this for:** Understanding data model, schema design, domain boundaries

2. **[INTELLIGENCE.md](./INTELLIGENCE.md)** - AI-Powered Query System
   - WorldQuery lifecycle management
   - QueryContext memory model
   - QueryResponse types (Answer/NeedsMoreInfo)
   - InfoCapabilities system with 6 built-in capabilities
   - Integration ports (semantic search, graph traversal)
   - Complete execution flow and code examples
   - **Use this for:** Understanding LLM integration, query execution, capability system

3. **[INTELLIGENCE_SUMMARY.md](./INTELLIGENCE_SUMMARY.md)** - Quick Reference
   - 4-section overview of key concepts
   - Method signatures and APIs
   - Constraint system explanation
   - Example usage code
   - File organization reference
   - **Use this for:** Fast lookup, code patterns, API reference

### Additional Resources

- **[README.md](./README.md)** - Project overview and getting started
- **[ROADMAP.md](./ROADMAP.md)** - Implementation phases and future work
- **[USECASES.md](./USECASES.md)** - Detailed use cases and workflows

## 🏗️ System Architecture

### Layer Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
│  Use Cases, Error Handling, Business Logic Orchestration   │
│  Uses tRPC, Zod, Express                                    │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    Domain Layer                             │
│  Business Rules, Aggregates, Entities, Ports                │
│  Independent of infrastructure and frameworks              │
│                                                             │
│  ├─ World Domain: World, Entity, Relationship, Property   │
│  ├─ Metadata Domain: EntityDefinition, PropertyDefinition │
│  ├─ Intelligence Domain: WorldQuery, QueryContext, etc    │
│  └─ Shared: Type-safe IDs, interfaces                      │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                Infrastructure Layer                         │
│  Database, Search, Messaging, External Services            │
│  Uses Drizzle ORM, PostgreSQL, pgvector                     │
│                                                             │
│  ├─ Database: DrizzleWorldRepository, schema               │
│  ├─ Semantic Search: (To be implemented)                   │
│  ├─ Relationship Provider: (To be implemented)             │
│  └─ Config: Database connection, environment               │
└─────────────────────────────────────────────────────────────┘
```

### Dependency Direction

All dependencies point downward or horizontally:

- Application depends on Domain and Infrastructure
- Domain depends only on other Domain concepts
- Infrastructure implements Domain ports (interfaces)
- Cross-layer communication through well-defined ports

## 🔄 Data Flow Example: World Creation

```
User Request (API)
    ↓
Express Route Handler (Application)
    ↓
CreateWorldUseCase (Application)
    ├─ Validate input (Zod schema)
    ├─ Check for duplicates (Port)
    └─ Invoke domain → World.create()
    ↓
World Domain Entity (Domain)
    ├─ Validate business rules
    └─ Return World aggregate
    ↓
Repository.save() (Port)
    ↓
DrizzleWorldRepository (Infrastructure)
    ├─ Adapt domain to database row
    └─ Execute INSERT via Drizzle
    ↓
PostgreSQL (Database)
    ↓
Response returned to User
```

## 🧠 Intelligence System Flow

```
User Question
    ↓
WorldQuery.create() + startProcessing() (Domain)
    ↓
semanticSearch.search() (Port) → EntitySummaries
    ↓
QueryContext.create() (Domain) with summaries
    ↓
buildCapabilities(context) (Domain)
    ↓
LLM Provider (Port) → Answer or NeedsMoreInfo
    ↓
    ├─ If Answer → query.complete() → Return
    │
    └─ If NeedsMoreInfo & iterations < max:
        ├─ Validate InfoRequests
        ├─ Fulfil requests (Database, Search, Graph)
        ├─ context.merge(results)
        ├─ recordInfoRequest()
        └─ Loop back to buildCapabilities()
```

## 🔌 Integration Points (Ports)

### Domain Ports (Infrastructure Must Implement)

**World Domain:**

- `IWorldRepository` - Persist/retrieve worlds

**Intelligence Domain:**

- `ISemanticSearchProvider` - Vector search capabilities
- `IRelationshipProvider` - Graph traversal operations
- `IWorldIntelligenceProvider` - Main orchestrator

### Current Implementations

| Port                       | Implementation         | Status          |
| -------------------------- | ---------------------- | --------------- |
| IWorldRepository           | DrizzleWorldRepository | ✅ Implemented  |
| ISemanticSearchProvider    | (Pending)              | 🔄 To implement |
| IRelationshipProvider      | (Pending)              | 🔄 To implement |
| IWorldIntelligenceProvider | (Pending)              | 🔄 To implement |

## 📦 Packages

```
resonance/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── domain/           ← Core business logic
│   │   │   ├── application/      ← Use cases, error handling
│   │   │   └── infrastructure/   ← Database, external services
│   │   └── tests/
│   │
│   ├── frontend/                 ← Vue 3 + Vite
│   │   └── (Under development)
│   │
│   └── api/                       ← tRPC contracts
│       └── (To be implemented)
│
└── Documentation (this directory)
    ├── DOMAIN.md
    ├── INTELLIGENCE.md
    ├── INTELLIGENCE_SUMMARY.md
    └── ARCHITECTURE.md (this file)
```

## 🎯 Key Architectural Decisions

### 1. Domain-Driven Design (DDD)

Separate business logic (domain) from application concerns and technical infrastructure.

**Benefit:** Domain remains testable, reusable, and independent of frameworks

### 2. Hexagonal Architecture (Ports & Adapters)

Define domain requirements as ports (interfaces), let infrastructure provide implementations.

**Benefit:** Easy to swap implementations, test with mocks, add new providers

### 3. Aggregate Pattern

Group related entities into aggregates with clear boundaries (World, Entity).

**Benefit:** Consistency, clear data ownership, easier transactions

### 4. Type-Safe IDs (Branded Types)

Use TypeScript branded types for entity IDs to prevent mixing different ID types.

**Benefit:** Compile-time safety, self-documenting code, zero runtime overhead

### 5. Progressive Context Building

Build LLM context incrementally, expanding only as needed.

**Benefit:** Token efficiency, adaptable to different context sizes, supports long conversations

### 6. Constraint-Based Capabilities

Define information retrieval capabilities with strict constraints.

**Benefit:** Prevent LLM hallucination, ensure valid requests, predictable behavior

## 🔍 Domain Boundaries

### World Domain

Everything within a world: entities, properties, relationships, content.

**Responsibility:** Core worldbuilding data structures and their relationships

### Intelligence Domain

AI-powered query system and reasoning.

**Responsibility:** Query execution, context management, LLM coordination

### Application Domain

Use cases, business logic orchestration, error handling.

**Responsibility:** Coordinate domain objects, handle validation, define workflows

## 📈 Extension Points

### Adding a New Entity Type

1. Add domain entity in `domain/world/`
2. Create Drizzle schema in `infrastructure/database/schema/`
3. Add repository interface and implementation
4. Create use cases in `application/`

### Adding a New Capability

1. Define capability in `domain/intelligence/capabilities.ts`
2. Add capability builder function
3. Update LLM prompt format in `formatCapabilitiesForPrompt()`
4. Implement fulfillment in application layer

### Adding a New Port

1. Define interface in domain (e.g., `domain/intelligence/my.port.ts`)
2. Create application-layer orchestration code
3. Implement infrastructure adapter
4. Wire up in application bootstrap

## 🧪 Testing Strategy

### Domain Tests

Test business logic in isolation (no database, no network).

```typescript
const world = World.create({ name: 'Test World' });
expect(world.name).toBe('Test World');
expect(world.status).toBe('active');
```

### Application Tests

Mock domain objects and repositories.

```typescript
const mockRepo = mock(IWorldRepository);
const useCase = new CreateWorldUseCase(mockRepo);
```

### Integration Tests

Use real database (test database), test full flow.

```typescript
await db.migrate();
const result = await createWorldUseCase.execute(params);
```

## 🚀 Development Workflow

1. **Design:** Start with domain model, define aggregates
2. **Implement:** Domain first, then application, then infrastructure
3. **Test:** Domain logic → Application logic → Integration
4. **Expose:** Define API contracts via tRPC
5. **Integrate:** Connect to frontend

## 📖 Reading Order

**New to the codebase:**

1. Start with [DOMAIN.md](./DOMAIN.md) - Understand data model
2. Read [INTELLIGENCE.md](./INTELLIGENCE.md) - See how queries work
3. Use [INTELLIGENCE_SUMMARY.md](./INTELLIGENCE_SUMMARY.md) - Keep as reference

**Implementing a feature:**

1. Check [ROADMAP.md](./ROADMAP.md) - Is it planned?
2. Review relevant section in DOMAIN.md or INTELLIGENCE.md
3. Look at similar existing implementation
4. Implement domain first
5. Add infrastructure adapter

**Debugging an issue:**

1. Check domain logic (invariants, aggregates)
2. Check application logic (orchestration, validation)
3. Check infrastructure (database, external services)
4. Use domain tests to isolate problem

---

**Last Updated:** December 17, 2025
**Current Status:** Phase 1 (Database & Core Models)
