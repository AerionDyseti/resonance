# Storage Persistence and Retrieval System

> Comprehensive documentation of Resonance's data storage architecture, including database schema, repositories, domain entities, and data flow patterns.

---

## Table of Contents

1. [Database Schema (Drizzle ORM)](#1-database-schema-drizzle-orm)
2. [Database Connection & Initialization](#2-database-connection--initialization)
3. [Data Access Layer (Repository Pattern)](#3-data-access-layer-repository-pattern)
4. [Domain Layer (Business Logic & Entities)](#4-domain-layer-business-logic--entities)
5. [Application Layer (Use Cases & Input/Output)](#5-application-layer-use-cases--inputoutput)
6. [Module Exports & Structure](#6-module-exports--structure)
7. [Flow Diagrams](#7-flow-diagrams)
8. [Key Architectural Patterns](#8-key-architectural-patterns)
9. [Key Files Reference](#9-key-files-reference)
10. [Pending Implementation](#10-pending-implementation)

---

## 1. DATABASE SCHEMA (Drizzle ORM)

### Core Tables

**Location:** `packages/backend/src/infrastructure/database/schema/`

#### Users Table (`users.ts`)

- **Purpose:** Authentication and profile data
- **Fields:**
  - `id` (uuid, PK)
  - `displayName` (varchar 255)
  - `email` (varchar 255, unique)
  - `avatarUrl` (text)
  - `createdAt`, `updatedAt` (timestamps with timezone)
- **Status:** MVP with placeholder auth (to be implemented)

#### Worlds Table (`worlds.ts`)

- **Purpose:** Top-level container for worldbuilding projects
- **Fields:**
  - `id` (uuid, PK)
  - `ownerId` (uuid, FK → users.id, cascade delete)
  - `name` (varchar 255)
  - `description` (text)
  - `createdAt`, `updatedAt` (timestamps)
- **Relations:** One-to-many with users; parent to all world content

#### Entity Definitions Table (`entity-definitions.ts`)

- **Purpose:** Schema definitions for entity types (Character, Location, Item, etc.)
- **Fields:**
  - `id` (uuid, PK)
  - `worldId` (uuid, FK → worlds.id, cascade delete)
  - `name` (varchar 255)
  - `description` (text)
  - `icon` (varchar 50)
  - `propertyDefinitionIds` (uuid[], references property definitions)
  - `createdAt`, `updatedAt`
- **Constraint:** Per-world entity type definitions

#### Property Definitions Table (`property-definitions.ts`)

- **Purpose:** Reusable field schemas defining what properties can exist
- **Fields:**
  - `id` (uuid, PK)
  - `worldId` (uuid, FK → worlds.id, cascade delete)
  - `name` (varchar 255)
  - `type` (varchar 50): `'text'`, `'number'`, `'boolean'`, `'date'`, `'rich-text'`, `'reference'`, `'enum'`
  - `description` (text)
  - `required` (boolean, default false)
  - `defaultValue` (jsonb)
  - `constraints` (jsonb):
    - `minLength`, `maxLength`, `minValue`, `maxValue`, `pattern`
    - `options` (string[] for enum type)
    - `referencedEntityDefinitionId` (for reference type)
  - `createdAt`, `updatedAt`

#### Entities Table (`entities.ts`)

- **Purpose:** Content instances (characters, locations, items, etc.)
- **Fields:**
  - `id` (uuid, PK)
  - `worldId` (uuid, FK → worlds.id, cascade delete)
  - `definitionId` (uuid, FK → entityDefinitions.id)
  - `name` (varchar 255)
  - `slug` (varchar 255)
  - `aliases` (text[])
  - `summary` (text)
  - `body` (text, default '')
  - `imageUrl` (text)
  - **`properties` (jsonb[])** - Array of PropertyJson objects:
    ```typescript
    {
      id: string;
      definitionId: string;
      value: string | number | boolean | string[] | null;
      createdAt: string; // ISO date
      updatedAt: string; // ISO date
    }
    ```
  - `tagIds` (uuid[])
  - `createdAt`, `updatedAt`
- **Index:** `entities_world_slug_idx` (unique on worldId + slug)

#### Relationships Table (`relationships.ts`)

- **Purpose:** Entity connections forming a knowledge graph
- **Fields:**
  - `id` (uuid, PK)
  - `worldId` (uuid, FK → worlds.id, cascade delete)
  - `definitionId` (uuid, FK → relationshipDefinitions.id)
  - `sourceEntityId` (uuid, FK → entities.id, cascade delete)
  - `targetEntityId` (uuid, FK → entities.id, cascade delete)
  - **`properties` (jsonb[])** - Same structure as entity properties
  - `createdAt`, `updatedAt`
- **Indexes:**
  - `relationships_source_idx` (on sourceEntityId)
  - `relationships_target_idx` (on targetEntityId)
  - `relationships_world_idx` (on worldId)

#### Relationship Definitions Table (`relationship-definitions.ts`)

- **Purpose:** Schema for relationship types
- **Fields:**
  - `id` (uuid, PK)
  - `worldId` (uuid, FK → worlds.id, cascade delete)
  - `name` (varchar 255)
  - `description` (text)
  - `inverseName` (varchar 255, optional) - e.g., "parent_of" / "child_of"
  - `isSymmetric` (boolean, default false)
  - `sourceEntityDefinitionId` (uuid, FK, optional) - constraint on source type
  - `targetEntityDefinitionId` (uuid, FK, optional) - constraint on target type
  - `propertyDefinitionIds` (uuid[]) - properties attachable to relationships
  - `createdAt`, `updatedAt`

#### Tags Table (`tags.ts`)

- **Purpose:** Taxonomy labels for organizing entities
- **Fields:**
  - `id` (uuid, PK)
  - `worldId` (uuid, FK → worlds.id, cascade delete)
  - `name` (varchar 255)
  - `description` (text)
  - `color` (varchar 7, hex color)
  - `createdAt`, `updatedAt`

### Drizzle Relations (`relations.ts`)

Type-safe relationship definitions enabling nested queries:

```
users (1) ──→ (many) worlds
       ↓
worlds (1) ──→ (many) entityDefinitions
       ↓     ──→ (many) propertyDefinitions
       ↓     ──→ (many) entities
       ↓     ──→ (many) relationships
       ↓     ──→ (many) relationshipDefinitions
       ↓     ──→ (many) tags
       ↓
entities (1) ──→ (many) properties (via jsonb array)
       ↓
relationships (1) ──→ (many) properties (via jsonb array)
```

---

## 2. DATABASE CONNECTION & INITIALIZATION

**Location:** `packages/backend/src/infrastructure/database/`

### Connection Setup (`connection.ts`)

```typescript
// PostgreSQL pool with environment-based configuration
const pool = new Pool({
  connectionString: databaseConfig.url,
  min: databaseConfig.pool.min,  // Dev: 1, Prod: 2
  max: databaseConfig.pool.max   // Dev: 5, Prod: 10
  ssl: databaseConfig.ssl        // Dev: false, Prod: true
});

export const db = drizzle(pool, { schema });
export type Database = typeof db;

async function closeDatabase(): Promise<void>
```

### Configuration (`config/database.config.ts`)

- Derives from environment variables (`.env`)
- Connection string validation via Zod
- Pool sizing per NODE_ENV
- SSL configuration per environment

**Location:** `packages/backend/src/infrastructure/config/`

---

## 3. DATA ACCESS LAYER (Repository Pattern)

**Location:** `packages/backend/src/infrastructure/database/repositories/`

### Repository Interface (Domain)

**File:** `packages/backend/src/domain/world/world.repository.ts`

```typescript
export interface IWorldRepository {
  findById(id: WorldId): Promise<World | null>;
  findAll(params?: { limit?: number; offset?: number }): Promise<World[]>;
  count(): Promise<number>;
  existsByName(name: string, excludeId?: WorldId): Promise<boolean>;
  save(world: World): Promise<void>; // Create or update
  delete(id: WorldId): Promise<boolean>;
  searchByName(searchTerm: string, params?: { limit?: number; offset?: number }): Promise<World[]>;
}
```

### Implementation: DrizzleWorldRepository

**File:** `packages/backend/src/infrastructure/database/repositories/drizzle-world.repository.ts`

**Key Methods:**

1. **`findById(id)`** - Single record by ID

   ```typescript
   const rows = await this.db.select().from(worlds).where(eq(worlds.id, id)).limit(1);
   return rows.length === 0 ? null : this.toDomain(rows[0]);
   ```

2. **`findAll(limit, offset)`** - Pagination support

   ```typescript
   const rows = await this.db
     .select()
     .from(worlds)
     .limit(limit ?? 20)
     .offset(offset ?? 0);
   ```

3. **`count()`** - Total record count

   ```typescript
   const result = await this.db.select({ count: sql<number>`count(*)` }).from(worlds);
   return Number(result[0]?.count ?? 0);
   ```

4. **`existsByName(name, excludeId?)`** - Duplicate checking
   - Supports optional exclusion for update scenarios
   - Case-sensitive exact match

5. **`save(world)`** - Upsert (insert or update)

   ```typescript
   await this.db
     .insert(worlds)
     .values(row)
     .onConflictDoUpdate({
       target: worlds.id,
       set: { name: row.name, description: row.description, updatedAt: row.updatedAt },
     });
   ```

6. **`delete(id)`** - Hard delete with cascade

   ```typescript
   const result = await this.db
     .delete(worlds)
     .where(eq(worlds.id, id))
     .returning({ id: worlds.id });
   return result.length > 0;
   ```

7. **`searchByName(searchTerm, limit, offset)`** - Case-insensitive partial match
   ```typescript
   const rows = await this.db
     .select()
     .from(worlds)
     .where(ilike(worlds.name, `%${searchTerm}%`))
     .limit(limit)
     .offset(offset);
   ```

**Data Mapping:**

- `toDomain(row)` - Convert DB row → Domain entity
- `toRow(world)` - Convert Domain entity → DB row
- Uses branded ID types (WorldId, UserId) for compile-time type safety

---

## 4. DOMAIN LAYER (Business Logic & Entities)

**Location:** `packages/backend/src/domain/world/`

### Core Domain Entities

#### World (`world.ts`)

```typescript
class World {
  // Public readonly properties
  readonly id: WorldId;
  readonly ownerId: UserId;
  readonly createdAt: Date;

  // Private mutable properties
  private _name: string;
  private _description: string | null;
  private _updatedAt: Date;

  // Factory methods
  static create(params: { ownerId: UserId; name: string; description?: string }): World;
  static existing(data: IWorld): World;

  // Business operations
  updateName(newName: string): void;
  updateDescription(newDescription: string | null): void;
  update(params: { name?: string; description?: string | null }): void;

  // Business queries
  isNew(): boolean; // Created within 24 hours
  getSummary(): string;

  // Validation
  private static validateName(name: string): string; // 1-255 chars
}
```

#### Entity (`entity.ts`)

```typescript
class Entity {
  readonly id: EntityId;
  readonly worldId: WorldId;
  readonly definitionId: EntityDefinitionId;

  private _name: string;
  private _slug: string;
  private _aliases: string[];
  private _summary: string | null;
  private _body: string;
  private _imageUrl: string | null;
  private _properties: Property[];
  private _tagIds: TagId[];
  readonly createdAt: Date;
  private _updatedAt: Date;

  // Factory methods
  static create(params): Entity;
  static existing(data: IEntity): Entity;

  // Getters
  get name(): string;
  get slug(): string;
  get aliases(): readonly string[];
  get summary(): string | null;
  get body(): string;
  get imageUrl(): string | null;
  get properties(): readonly Property[];
  get tagIds(): readonly TagId[];
  get updatedAt(): Date;
}
```

#### Property (`property.ts`)

```typescript
type PropertyValue = string | number | boolean | string[] | null;

class Property {
  readonly id: PropertyId;
  readonly definitionId: PropertyDefinitionId;
  readonly createdAt: Date;

  private _value: PropertyValue;
  private _updatedAt: Date;

  static create(params: { definitionId; value }): Property;
  static existing(data: IProperty): Property;

  get value(): PropertyValue;
  get updatedAt(): Date;
}
```

#### Relationship (`relationship.ts`)

```typescript
class Relationship {
  readonly id: RelationshipId;
  readonly worldId: WorldId;
  readonly definitionId: RelationshipDefinitionId;
  readonly sourceEntityId: EntityId;
  readonly targetEntityId: EntityId;
  readonly createdAt: Date;

  private _properties: Property[];
  private _updatedAt: Date;

  static create(params): Relationship;
  static existing(data: IRelationship): Relationship;

  get properties(): readonly Property[];
  get updatedAt(): Date;
}
```

### ID System (Branded Types)

**File:** `packages/backend/src/domain/shared/ids.ts`

Uses TypeScript branded/nominal types for compile-time type safety:

```typescript
// Type definitions
type UserId = Brand<string, 'UserId'>;
type WorldId = Brand<string, 'WorldId'>;
type EntityId = Brand<string, 'EntityId'>;
type EntityDefinitionId = Brand<string, 'EntityDefinitionId'>;
type PropertyDefinitionId = Brand<string, 'PropertyDefinitionId'>;
type RelationshipDefinitionId = Brand<string, 'RelationshipDefinitionId'>;
type RelationshipId = Brand<string, 'RelationshipId'>;
type PropertyId = Brand<string, 'PropertyId'>;
type TagId = Brand<string, 'TagId'>;
type BodySegmentId = Brand<string, 'EmbeddingChunkId'>;
type QueryId = Brand<string, 'QueryId'>;

// Factory functions (string → branded type)
export function worldId(id: string): WorldId;
export function entityId(id: string): EntityId;
// ... etc

// Creation functions (generate new UUID)
export function createWorldId(): WorldId;
export function createEntityId(): EntityId;
// ... etc

// Utility
export function isValidUuid(value: unknown): value is string;
```

---

## 5. APPLICATION LAYER (Use Cases & Input/Output)

**Location:** `packages/backend/src/application/world/`

### Zod Schemas (`world.schemas.ts`)

All use case inputs validated with Zod:

```typescript
// Create
const createWorldInputSchema = z.object({
  ownerId: z.string().uuid(),
  name: z
    .string()
    .min(1)
    .max(255)
    .transform((s) => s.trim()),
  description: z
    .string()
    .max(5000)
    .transform((s) => s.trim())
    .optional(),
});
export type CreateWorldInput = z.infer<typeof createWorldInputSchema>;

// Update
const updateWorldInputSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(1)
    .max(255)
    .transform((s) => s.trim())
    .optional(),
  description: z
    .string()
    .max(5000)
    .transform((s) => s.trim())
    .nullable()
    .optional(),
});
export type UpdateWorldInput = z.infer<typeof updateWorldInputSchema>;

// List
const listWorldsInputSchema = z.object({
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
});
export type ListWorldsInput = z.infer<typeof listWorldsInputSchema>;
```

### Use Cases

#### CreateWorldUseCase

**File:** `packages/backend/src/application/world/create-world.ts`

```typescript
class CreateWorldUseCase {
  constructor(private readonly worldRepository: IWorldRepository) {}

  async execute(params: CreateWorldParams): Promise<World> {
    // 1. Validate input via Zod
    const validated = createWorldInputSchema.parse(params);

    // 2. Check for duplicate name
    const nameExists = await this.worldRepository.existsByName(validated.name);
    if (nameExists) throw new ConflictError('World', 'name', validated.name);

    // 3. Create domain entity
    const world = World.create({
      ownerId: userId(validated.ownerId),
      name: validated.name,
      description: validated.description,
    });

    // 4. Persist
    await this.worldRepository.save(world);

    return world;
  }
}
```

#### GetWorldUseCase

**File:** `packages/backend/src/application/world/get-world.ts`

```typescript
class GetWorldUseCase {
  constructor(private readonly worldRepository: IWorldRepository) {}

  async execute(id: WorldId): Promise<World> {
    const world = await this.worldRepository.findById(id);
    if (!world) throw new NotFoundError('World', id);
    return world;
  }
}
```

#### ListWorldsUseCase

**File:** `packages/backend/src/application/world/list-worlds.ts`

```typescript
interface ListWorldsResult {
  worlds: World[];
  total: number;
}

class ListWorldsUseCase {
  async execute(params?: Partial<ListWorldsInput>): Promise<ListWorldsResult> {
    const validated = listWorldsInputSchema.parse(params ?? {});

    const [worlds, total] = await Promise.all([
      this.worldRepository.findAll({ limit: validated.limit, offset: validated.offset }),
      this.worldRepository.count(),
    ]);

    return { worlds, total };
  }
}
```

#### UpdateWorldUseCase

**File:** `packages/backend/src/application/world/update-world.ts`

```typescript
class UpdateWorldUseCase {
  async execute(params: UpdateWorldParams): Promise<World> {
    // 1. Validate
    const validated = updateWorldInputSchema.parse(params);

    // 2. Find existing
    const world = await this.worldRepository.findById(worldId(validated.id));
    if (!world) throw new NotFoundError('World', validated.id);

    // 3. Check for name conflict if changing
    if (validated.name !== undefined) {
      const nameExists = await this.worldRepository.existsByName(
        validated.name,
        worldId(validated.id)
      );
      if (nameExists) throw new ConflictError('World', 'name', validated.name);
    }

    // 4. Apply updates
    world.update({
      name: validated.name,
      description: validated.description,
    });

    // 5. Persist
    await this.worldRepository.save(world);

    return world;
  }
}
```

#### DeleteWorldUseCase

**File:** `packages/backend/src/application/world/delete-world.ts`

```typescript
class DeleteWorldUseCase {
  async execute(id: WorldId): Promise<void> {
    const deleted = await this.worldRepository.delete(id);
    if (!deleted) throw new NotFoundError('World', id);
  }
}
```

### Error Handling

**Location:** `packages/backend/src/application/errors/`

Base error class with HTTP status mapping:

```typescript
abstract class ApplicationError extends Error {
  abstract readonly code: string;
  abstract readonly httpStatus: number;

  toJSON(): { code: string; message: string };
}

// Specific errors
class NotFoundError extends ApplicationError {
  code = 'NOT_FOUND';
  httpStatus = 404;
  constructor(resourceType: string, resourceId: string);
}

class ConflictError extends ApplicationError {
  code = 'CONFLICT';
  httpStatus = 409;
  constructor(resourceType: string, conflictField: string, conflictValue: string);
}

class ValidationError extends ApplicationError {
  code = 'VALIDATION_ERROR';
  httpStatus = 400;
}
```

---

## 6. MODULE EXPORTS & STRUCTURE

**Location:** `packages/backend/src/`

**Infrastructure exports** (`infrastructure/index.ts`):

```typescript
export * from './config/index'; // Database config, env vars
export * from './database/index'; // Connection, schema, repositories
```

**Application exports** (`application/index.ts`):

```typescript
export * from './errors'; // Error classes
export * from './world'; // Use cases + schemas
```

**Application/World exports** (`application/world/index.ts`):

```typescript
export { CreateWorldUseCase, ... } from './create-world';
export { GetWorldUseCase } from './get-world';
export { ListWorldsUseCase } from './list-worlds';
export { UpdateWorldUseCase } from './update-world';
export { DeleteWorldUseCase } from './delete-world';
export { createWorldInputSchema, ... } from './world.schemas';
```

---

## 7. FLOW DIAGRAMS

### Complete Request → Response Flow

```
HTTP Request
    ↓
tRPC Router (to be implemented in /packages/api)
    ↓
Use Case (e.g., CreateWorldUseCase)
    ↓
1. Input Validation (Zod schema)
    ↓
2. Repository Query (existsByName, findById)
    ↓
3. Domain Entity Operation (World.create, world.update)
    ↓
4. Repository Save (upsert to database)
    ↓
Application/Domain Response
    ↓
HTTP Response (via tRPC serializer)
```

### Data Persistence Flow

```
Domain Entity (World)
    ↓ toRow()
Database Row (WorldRow)
    ↓ INSERT/UPDATE
PostgreSQL Database
    ↓ SELECT
Database Row (WorldRow)
    ↓ toDomain()
Domain Entity (World)
```

### Relationship Navigation

```
World (1)
  ├─ EntityDefinitions (many)
  │  └─ PropertyDefinitions (many)
  ├─ Entities (many)
  │  ├─ Properties (jsonb array)
  │  └─ TagIds (uuid array)
  ├─ Relationships (many)
  │  ├─ sourceEntity (FK)
  │  ├─ targetEntity (FK)
  │  └─ Properties (jsonb array)
  └─ RelationshipDefinitions (many)
```

---

## 8. KEY ARCHITECTURAL PATTERNS

### 1. Branded Types for Type Safety

- IDs are branded strings, preventing accidental mixing of different ID types
- Compile-time validation with zero runtime overhead

### 2. Repository Pattern (Dependency Inversion)

- Domain defines `IWorldRepository` interface
- Infrastructure implements `DrizzleWorldRepository`
- Use cases depend on abstraction, not concrete implementation
- Enables testing with mocks

### 3. Clean Architecture Layering

- **Domain:** Pure business logic (World, Entity, Property, Relationship classes)
- **Application:** Use cases orchestrating domain + repository
- **Infrastructure:** Technical details (Drizzle, PostgreSQL, config)

### 4. Aggregate Root Pattern

- `World` is aggregate root for world-specific data
- Cascade deletes ensure referential integrity
- Transactions implicit via Drizzle ORM

### 5. JSONB for Flexible Properties

- Properties stored as `jsonb[]` arrays instead of separate tables
- Enables schema flexibility without schema migrations
- PropertyId, definitionId, value, createdAt, updatedAt in each element

### 6. Zod for Input Validation

- All external input validated before domain processing
- Schemas document expected shape and constraints
- Transformations (trim, case conversion) applied automatically

### 7. Error Codes for API Integration

- ApplicationError base class with `code` and `httpStatus`
- Ready for tRPC error mapping
- JSON serialization for API responses

---

## 9. KEY FILES REFERENCE

| Purpose                   | File Path                                                                               |
| ------------------------- | --------------------------------------------------------------------------------------- |
| Database Schema           | `packages/backend/src/infrastructure/database/schema/*.ts`                              |
| Repository Interface      | `packages/backend/src/domain/world/world.repository.ts`                                 |
| Repository Implementation | `packages/backend/src/infrastructure/database/repositories/drizzle-world.repository.ts` |
| Domain Entities           | `packages/backend/src/domain/world/{world,entity,property,relationship}.ts`             |
| ID Types & Factories      | `packages/backend/src/domain/shared/ids.ts`                                             |
| Use Cases                 | `packages/backend/src/application/world/{create,get,list,update,delete}-world.ts`       |
| Input Schemas             | `packages/backend/src/application/world/world.schemas.ts`                               |
| Error Classes             | `packages/backend/src/application/errors/{application-error,not-found,conflict}.ts`     |
| DB Connection             | `packages/backend/src/infrastructure/database/connection.ts`                            |
| Configuration             | `packages/backend/src/infrastructure/config/{database.config,env}.ts`                   |

---

## 10. PENDING IMPLEMENTATION

1. **tRPC Routers** - Not yet implemented in `/packages/api`
   - Will wrap use cases and expose via tRPC procedures
   - Will map ApplicationErrors to tRPC errors

2. **Frontend Query Integration** - TanStack Query integration (mentioned in stack) not yet visible
   - Will consume tRPC endpoints
   - Handle caching, refetching, mutations

3. **Additional Repositories** - Currently only DrizzleWorldRepository exists
   - EntityRepository, RelationshipRepository, EntityDefinitionRepository, etc. needed
   - Same pattern as DrizzleWorldRepository

4. **LLM Integration Ports** - Domain layer defines ports (interface stubs) but no implementation
   - `packages/backend/src/domain/intelligence/*.port.ts` define contracts
   - Infrastructure adapters to be implemented

---

## Summary

This is a well-structured system using **clean architecture**, **domain-driven design**, and **SOLID principles**. The persistence layer is:

- **Independent** from business logic
- **Easily testable** via repository abstractions
- **Type-safe** throughout with branded IDs and Zod validation
